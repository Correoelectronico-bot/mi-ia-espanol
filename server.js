// server.js
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// simple rate limiter
const limiter = rateLimit({ windowMs: 60 * 1000, max: 60 }); // 60 req/min
app.use(limiter);

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.warn("No OPENAI_API_KEY provided in env");
}

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body; // messages: [{role:'user'|'assistant'|'system', content:''}, ...]
    if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: "messages array required" });

    // Example using OpenAI Chat Completions (adjust model name if needed)
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // cambia por el modelo que tengas permitido
        messages,
        max_tokens: 800,
        temperature: 0.7
      })
    });
    const data = await resp.json();
    // standard: data.choices[0].message
    const reply = data?.choices?.[0]?.message || { role: "assistant", content: "" };
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
