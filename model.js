const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  text: String,
  generatedText: String,
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  favorites: [{ type: String }] ,
});

const note = mongoose.model("note", noteSchema);

module.exports = note;
