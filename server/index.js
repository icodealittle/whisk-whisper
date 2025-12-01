import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// --- OpenAI.fm endpoint (text → realistic speech) ---
app.post("/api/speak", async (req, res) => {
  try {
    const { text, voice = "alloy" } = req.body;

    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        input: text,
        voice
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI.fm error:", errText);
      return res.status(500).send("Speech synthesis failed");
    }

    const buffer = await response.arrayBuffer();
    res.set({
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-cache"
    });
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Internal server error");
  }
});

// --- Start server ---
app.listen(PORT, () =>
  console.log(`🎧 Whisk & Whisper voice server running on port ${PORT}`)
);
