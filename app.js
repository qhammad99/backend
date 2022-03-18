const express = require('express');

const app = express();
app.use(express.json());

//import routes
const user = require('./routes/user');
const parameters = require('./routes/parameters');
const goal = require('./routes/goal');
const ingredients = require('./routes/ingredients');
const workout = require('./routes/workout');
const recipies = require('./routes/recipies');

app.use('/api/v1', user);
app.use('/api/v1', parameters);
app.use('/api/v1', goal);
app.use('/api/v1', ingredients);
app.use('/api/v1', workout);
app.use('/api/v1', recipies);

module.exports = app;