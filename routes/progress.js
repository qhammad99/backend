const express = require('express');
const router = express.Router();

const {isAuthenticated} = require('../middleware/userAuth');
const {
    progressTasks,
    attachDiet,
    attachWorkout,
    attachExtra,
    findByDay,
    findByDate,
    getByGoal
} = require('../controllers/progress');

router.route('/progress-tasks/:goal/:day').get(isAuthenticated, progressTasks); // get task detail of progress
router.route('/progress-attachDiet').post(isAuthenticated, attachDiet); // attach diet to progress
router.route('/progress-attachWorkout').post(isAuthenticated, attachWorkout); // attach workout to progress
router.route('/progress-attachExtra').post(isAuthenticated, attachExtra);// attach extra task to progress
router.route('/progress-find/day/:goal/:day').get(isAuthenticated, findByDay); // get progress by goal id and day no
router.route('/progress-find/date/:goal/:date').get(isAuthenticated, findByDate);// get progress by goal id and date
router.route('/progress-goal/:goal').get(isAuthenticated, getByGoal); // all progresses against goal id

module.exports = router;