const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  text: String,
  prompt: String,
  filePath: String,
  fileName: String,
  generatedText: String, 
});

const note = mongoose.model("note", noteSchema);

module.exports = note;
