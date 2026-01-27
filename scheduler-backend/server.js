require('dotenv').config();
const express = require('express');
const cors = require('cors');

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

app.use('/auth',authRoutes);
app.use('/admin',adminRoutes);
app.use('/candidate',candidateRoutes);



const PORT = process.env.PORT || 4000

app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}..........!`);
})  
