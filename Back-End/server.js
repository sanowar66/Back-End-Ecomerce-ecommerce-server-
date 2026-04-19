const express = require('express');
const bodyParser = require('body-parser')
const app = express();
require('dotenv').config();
const connectDB = require('./config/db')
connectDB()

app.use(express.json()); 
app.use(bodyParser.json())
const userRoute = require('./routes/api/users')
const productRoute = require('./routes/api/products')
const orderRoute = require('./routes/api/orders')
 
app.use('/api/products', productRoute)
app.use('/api/users', userRoute)
app.use('/api/orders', orderRoute)


app.get('/', (req, res) => {  
    res.send('E-commerce Backend Running');
});

app.listen(3003, () => {
    console.log('Server running on port 3003');   
});  