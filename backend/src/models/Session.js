import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    problem: {
        type: String,
        required: true,
    },
    problemPayload: {
        type: Object,
        default: null,
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        required: true,
    },
    interviewConfig: {
        selectionMode: {
            type: String,
            enum: ["manual", "ai_random"],
            default: "manual",
        },
        focus: {
            type: String,
            enum: ["situational", "system-design-lite", "algorithms"],
            default: "situational",
        },
        enforceFullscreen: {
            type: Boolean,
            default: true,
        },
        blockClipboard: {
            type: Boolean,
            default: true,
        },
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    participant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    status: {
        type: String,
        enum: ["active", "completed"],
        default: "active",
    },
    interviewSummary: {
        problemsSolved: {
            type: Number,
            default: 0,
            min: 0,
        },
        accuracy: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        interviewReadiness: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        attempts: {
            type: Number,
            default: 0,
            min: 0,
        },
        successfulRuns: {
            type: Number,
            default: 0,
            min: 0,
        },
        proctoring: {
            warnings: {
                type: Number,
                default: 0,
                min: 0,
            },
            violations: {
                type: Number,
                default: 0,
                min: 0,
            },
            totalAwaySeconds: {
                type: Number,
                default: 0,
                min: 0,
            },
            maxAwaySeconds: {
                type: Number,
                default: 0,
                min: 0,
            },
            integrityScore: {
                type: Number,
                default: 100,
                min: 0,
                max: 100,
            },
            riskLevel: {
                type: String,
                enum: ["low", "medium", "high"],
                default: "low",
            },
        },
        generatedAt: {
            type: Date,
            default: null,
        },
    },
    // stream video call ID
    callId: {
        type: String,
        default: "",
    },
    },
    { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;
