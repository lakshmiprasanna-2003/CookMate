const express = require("express");
const mongoose = require("mongoose");
const note = require("./model");
const cors = require("cors");
const dotenv = require("dotenv");

const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("DB connection error:", err));

const app = express();
app.use(express.json());
app.use(cors());


// ---------------- Gemini setup ----------------
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
console.log(
  "Gemini API Key starts with:",
  process.env.GEMINI_API ? "loaded" : "missing"
);


// ---------------- Generate + Save Note ----------------
app.post("/add", async (req, res) => {
  try {
    const { text, prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Text and Prompt are required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const input = `${prompt}\n\nUser Input: ${text}`;
    const result = await model.generateContent(input);
    const generatedText = result.response.text();

    const newNote = new note({ text, prompt, generatedText });
    await newNote.save();

    res.json({
      message: "Note saved",
      data: newNote,
      geminiResponse: generatedText,
    });
  } catch (err) {
    console.error("Error in /add:", err);
    res.status(500).json({ error: err.message });
  }
});


app.listen(5000, () => {
  console.log("server is running on 5000");
});
