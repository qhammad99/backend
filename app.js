const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const userInfo = require('./routes/userInfo');

const app = express();
app.use(bodyParser.json());
app.use('/users', userInfo);

app.get('/', (req, res)=>{
    res.send('Hello from Home Page');
})


module.exports = app;