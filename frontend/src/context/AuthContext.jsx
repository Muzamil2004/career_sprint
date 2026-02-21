import { createContext, useState, useContext, useEffect } from "react";
import axios from "../lib/axios.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      verifyToken();
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      const response = await axios.get("/auth/me");
      setUser(response.data.user);
      setIsSignedIn(true);
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
      setIsSignedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password, confirmPassword) => {
    const response = await axios.post("/auth/register", {
      name,
      email,
      password,
      confirmPassword,
    });
    localStorage.setItem("token", response.data.token);
    setUser(response.data.user);
    setIsSignedIn(true);
    return response.data;
  };

  const login = async (email, password) => {
    const response = await axios.post("/auth/login", { email, password });
    localStorage.setItem("token", response.data.token);
    setUser(response.data.user);
    setIsSignedIn(true);
    return response.data;
  };

  const logout = async () => {
    try {
      await axios.post("/auth/logout");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      setIsSignedIn(false);
    }
  };

  const loginWithGoogle = async (tokenId) => {
    const response = await axios.post("/auth/google", { tokenId });
    localStorage.setItem("token", response.data.token);
    setUser(response.data.user);
    setIsSignedIn(true);
    return response.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isSignedIn,
        register,
        login,
        logout,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
