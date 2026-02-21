import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { ENV } from "../lib/env.js";

const googleClientId = ENV.GOOGLE_CLIENT_ID?.trim();
const googleClient = new OAuth2Client(googleClientId);

const generateToken = (userId) => {
  return jwt.sign({ userId }, ENV.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export async function googleAuth(req, res) {
  try {
    const { tokenId } = req.body;

    if (!googleClientId) {
      return res.status(500).json({ message: "Google OAuth is not configured on server" });
    }

    if (!tokenId) {
      return res.status(400).json({ message: "Token is required" });
    }

    // Verify the token with Google
    const ticket = await googleClient.verifyIdToken({
      idToken: tokenId,
      audience: googleClientId,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Check if user exists
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        name,
        email: email.toLowerCase(),
        profileImage: picture,
        isOAuthUser: true,
      });
      await user.save();
    } else if (!user.profileImage && picture) {
      // Update profile image if user exists but doesn't have one
      user.profileImage = picture;
      await user.save();
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: ENV.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return user and token
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    let tokenAudience = "unknown";

    try {
      const tokenPayload = JSON.parse(Buffer.from(req.body?.tokenId?.split(".")[1] || "", "base64url").toString("utf-8"));
      tokenAudience = tokenPayload?.aud || "missing";
    } catch {
      tokenAudience = "unreadable";
    }

    console.error("Error in googleAuth controller:", {
      message: error.message,
      expectedAudience: googleClientId || "missing",
      tokenAudience,
    });

    const responseMessage =
      ENV.NODE_ENV === "development"
        ? `Invalid Google token: ${error.message}`
        : "Invalid token or authentication failed";

    res.status(401).json({ message: responseMessage });
  }
}
