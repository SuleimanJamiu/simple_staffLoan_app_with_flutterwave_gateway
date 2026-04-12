const express = require('express');
const router = require('./router/route');
const mongoose = require('mongoose');
const connectDB = require('./authentication/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/easyLoan/api', router);

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})