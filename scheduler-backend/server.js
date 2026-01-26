require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const candidateRoutes = require('./routes/candidateRoutes');


const app = express();

app.use(cors());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://interview-scheduler.vercel.app"
  ],
  credentials: true,
}));
app.use(express.json());

app.use('/auth',authRoutes);
app.use('/admin',adminRoutes);
app.use('/candidate',candidateRoutes);



const PORT = process.env.PORT || 4000;
app.listen(PORT,'localhost', ()=>{
    console.log(`server running on port ${PORT}..........!`);
})  
