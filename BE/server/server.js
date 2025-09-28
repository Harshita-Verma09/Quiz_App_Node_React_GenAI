
// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import path from "path";


const __dirname = path.resolve(); // For serving React build

dotenv.config();
const app = express();

// CORS config
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:4173",  // Vite preview server
    process.env.FRONTEND_URL              // deployed frontend URL (set in .env)
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use(express.json());

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// Helper: retry with delay
async function fetchWithRetry(prompt, retries = 2, delay = 5000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const completion = await groq.chat.completions.create({
                model: "llama-3.1-8b-instant",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.9,
            });
            return completion.choices?.[0]?.message?.content || null;
        } catch (err) {
            if (attempt < retries) {
                await new Promise((resolve) => setTimeout(resolve, delay));
            } else {
                throw err;
            }
        }
    }
}

// API route
app.post("/api/chat", async (req, res) => {
    try {
        const { selectedTopic } = req.body;
        if (!selectedTopic) {
            return res.status(400).json({ error: "selectedTopic is required" });
        }

        const prompt = `
Generate a challenging quiz question on the topic "${selectedTopic}". 

 Requirements:
1. Randomly assign the correct answer to A, B, C, or D (do not always use C).
2. Include multiple-choice questions (MCQs) and coding/output type questions randomly.
3. Avoid repeating questions.
4. Format strictly as below:

Q: <question text>
A. <option A>
B. <option B>
C. <option C>
D. <option D>
Correct Answer: <A/B/C/D>
Expected Output: <for coding/output questions only, optional>

Only return the question exactly in this format. Do NOT include explanations.
    `.trim();

        const reply = await fetchWithRetry(prompt, 2, 5000);

        if (!reply) {
            return res.status(500).json({ error: "Failed to generate question after retries" });
        }

        res.json({ response: reply });
    } catch (err) {
        res.status(500).json({
            error: "Something went wrong",
            details: err.message,
        });
    }
});
app.listen(5000, () => {
    console.log(" Server running on http://localhost:5000");
});
