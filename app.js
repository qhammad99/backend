const express = require('express');

const app = express();
app.use(express.json());

//import routes
const user = require('./routes/user');
const parameters = require('./routes/parameters');

app.use('/api/v1', user);
app.use('/api/v1', parameters);

module.exports = app;