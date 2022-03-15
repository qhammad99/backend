const express = require('express');

const app = express();
app.use(express.json());

//import routes
const user = require('./routes/user');
const parameters = require('./routes/parameters');
const goal = require('./routes/goal');
const ingredientsCategory = require('./routes/ingredients');
const workoutsCategory = require('./routes/workout');

app.use('/api/v1', user);
app.use('/api/v1', parameters);
app.use('/api/v1', goal);
app.use('/api/v1', ingredientsCategory);
app.use('/api/v1', workoutsCategory);

module.exports = app;