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
const schedule = require('./routes/schedule');
const dietPlan = require('./routes/dietPlan');
const workoutPlan = require('./routes/workoutPlan');
const progress = require('./routes/progress');

app.use('/api/v1', user);
app.use('/api/v1', parameters);
app.use('/api/v1', goal);
app.use('/api/v1', ingredients);
app.use('/api/v1', workout);
app.use('/api/v1', recipies);
app.use('/api/v1', schedule);
app.use('/api/v1', dietPlan);
app.use('/api/v1', workoutPlan);
app.use('/api/v1', progress);

module.exports = app;