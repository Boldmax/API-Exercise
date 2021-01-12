require('dotenv').config();
const express = require('express');
const app = express();
const router = require('./routers');
const mongoose = require('mongoose');



mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const dataB = mongoose.connection;
dataB.on('error', () => console.log('error'));
dataB.once('open', () => console.log('connected to database'));

app.use(express.json())

app.use(router)



app.listen(4000, () => {
    console.log('server is running')
})