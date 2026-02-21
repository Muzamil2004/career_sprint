import { chatClient } from "../lib/stream.js";
import { ENV } from "../lib/env.js";

export async function getStreamToken(req, res) {
    try {
        const userId = req.user._id.toString();
        const token = chatClient.createToken(userId);

        res.status(200).json({
            token,
            userId,
            userName: req.user.name,
            userImage: req.user.profileImage
        })
    } catch (error) {
        console.log("Error in getStreamToken controller:", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export async function generateInterviewFeedback(req, res) {
    try {
        const { prompt, code = "", language = "", problem = "" } = req.body || {};

        if (!ENV.OPENAI_API_KEY) {
            return res.status(500).json({ message: "OPENAI_API_KEY is not configured on server" });
        }

        if (!prompt || typeof prompt !== "string") {
            return res.status(400).json({ message: "prompt is required" });
        }

        const userPrompt = [
            `Question: ${prompt.trim()}`,
            language ? `Language: ${language}` : "",
            problem ? `Problem: ${problem}` : "",
            code ? `Code:\n${code}` : "",
        ]
            .filter(Boolean)
            .join("\n\n");

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ENV.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: ENV.OPENAI_MODEL,
                temperature: 0.2,
                messages: [
                    {
                        role: "system",
                        content:
                            "You are a senior interviewer. Give concise coding feedback with sections: strengths, issues, improvements, readiness score out of 100.",
                    },
                    {
                        role: "user",
                        content: userPrompt,
                    },
                ],
            }),
        });

        if (!response.ok) {
            const details = await response.text();
            return res.status(502).json({
                message: `OpenAI request failed (${response.status})`,
                details,
            });
        }

        const data = await response.json();
        const feedback = data?.choices?.[0]?.message?.content?.trim();

        if (!feedback) {
            return res.status(502).json({ message: "No feedback returned from model" });
        }

        return res.status(200).json({ feedback, model: ENV.OPENAI_MODEL });
    } catch (error) {
        console.log("Error in generateInterviewFeedback controller:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
