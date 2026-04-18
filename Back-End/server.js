const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./config/db')
connectDB()

app.use(express.json());

app.get('/', (req, res) => {
    res.send('E-commerce Backend Running');
});

app.listen(30001, () => {
    console.log('Server running on port 3001');
});