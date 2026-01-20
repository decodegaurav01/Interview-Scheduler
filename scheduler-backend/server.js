require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes')
const adminRoutes = require('./routes/adminRoutes')


const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth',authRoutes);
app.use('/admin',adminRoutes);



const PORT = process.env.PORT || 4000;
app.listen(PORT,'localhost', ()=>{
    console.log(`server running on port ${PORT}..........!`);
})  
