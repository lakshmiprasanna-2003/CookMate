const express = require("express");
const mongoose = require("mongoose");
const note = require("./model");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt= require('jsonwebtoken');
const Registeruser=require('./Auth');
const middleware=require('./Middleware')

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
  "Gemini API Key status:",
  process.env.GEMINI_API ? "loaded" : "missing"
);

// ---------------- Generate + Save Note ----------------
app.post("/add", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Send only user text
    const result = await model.generateContent(text);
    const generatedText = result.response.text();

    // Save note in MongoDB
    const newNote = new note({ text, generatedText });
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

app.post('/register',async(req,res)=>{
    try{
        const{username,email,password,confirmpassword}=req.body;
        let exist=await Registeruser.findOne({email})
        if (exist){
            return res.status(400).send('Already user exist')
        }if (password!==confirmpassword){
            return res.status(400).send('confirm password is not matching with password')  
        }
        let newUser=new Registeruser({
            username,
            email,
            password,
            confirmpassword
        })
        await newUser.save();
        return res.status(200).send('Register Sucessfully')
    }
    catch(err){
        console.log(err)
        return res.status(500).send('Internel Server Error')
    }
})

app.post('/login',async(req,res)=>{
    try{
        const{email,password}=req.body;
        let exist=await Registeruser.findOne({email});
        if(!exist){
            return res.status(400).send('User Not Found');
        }
        if(exist.password!==password){
            return res.status(400).send('Incorrect Password');
        }
        let payload={
            user:{
                id:exist.id
            }
        }
        jwt.sign(payload,'jwtsecret',{expiresIn:3600000}, 
            (err,token)=>{
            if (err) throw err;
            return res.json({token})
            }
        )
    }
        catch(err){
        console.log(err);
        return res.status(500).send("Server error")
    }
})

app.get('/profile', middleware, async(req,res)=>{
    try{
        let exist=await Registeruser.findById(req.user.id)
        if (!exist){
            return res.status(400).send('Token Not Found')
        }
        res.json(exist);
    }
    catch(err){
        console.log(err)
        return res.status(500).send("Server Error")
    }
})
<<<<<<< HEAD
const PORT =process.env.PORT ||5000

>>>>>>> cf62f78cc18758550fa15dbf4c978e74bfb9baf0
app.listen(PORT, "0.0.0.0",() => {
  console.log(`server is running on ${PORT}`);
});
