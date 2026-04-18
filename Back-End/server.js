const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./config/db')
connectDB()


const userRoute = require('./routes/api/users')
const productRoute = require('./routes/api/products')
const orderRoute = require('./routes/api/orders')

app.use('/api/products', productRoute)
app.use(express.json());

app.get('/', (req, res) => {
    res.send('E-commerce Backend Running');
});

app.listen(30001, () => {
    console.log('Server running on port 30001');
});