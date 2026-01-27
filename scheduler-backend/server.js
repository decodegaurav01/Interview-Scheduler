console.log("🚀 server.js loaded");
console.log("backend booted")
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { transporter } = require("./utils/mailer");

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const candidateRoutes = require('./routes/candidateRoutes');


const app = express();

app.use(cors({
  origin: "*"
}));

app.use(express.json());

app.get("/", (req,res)=>{
  res.status(200).json({
    status: "OK",
    message: "Server is running"
  })
})



app.get("/smtp-test", async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "SMTP Test",
      text: "SMTP working",
    });
    res.send("SMTP OK");
  } catch (err) {
    console.error("SMTP ERROR:", err);
    res.status(500).send(err.message);
  }
});


app.use('/auth',authRoutes);
app.use('/admin',adminRoutes);
app.use('/candidate',candidateRoutes);



const PORT = process.env.PORT || 4000
console.log("🚀 About to start Express server");

app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}..........!`);
})  
