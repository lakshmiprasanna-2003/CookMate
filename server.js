const express = require("express");
const mongoose = require("mongoose");
const note = require("./model");
const cors = require("cors");
const multer = require("multer");
const dotenv = require("dotenv");
const { Resend } = require("resend");
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

// ---------------- Send Mail with Resend ----------------

const resend = new Resend(process.env.RESEND_API);
console.log("Loaded RESEND_API:", process.env.RESEND_API ? "OK" : "MISSING");

app.post("/sendMail", async (req, res) => {
  const { to, subject, text } = req.body;
  try {

    const info = await resend.emails.send({
      from: "onboarding@resend.dev", // must be verified sender in Resend dashboard
      to,
      subject,
      text,
    });

    res.json({ success: true, message: "Mail Sent Successfully", info });
  } catch (error) {
    console.error("Email didn't send: ", error);
    res.status(500).json({ success: false, error: error.message });
  }
});



app.listen(5000, () => {
  console.log("server is running on 5000");
});
