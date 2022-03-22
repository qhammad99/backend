const express = require('express');
const router = express.Router();

const {isAuthenticated} = require('../middleware/userAuth');
const {
    progressTasks,
    attachDiet,
    attachWorkout,
    findByDay,
    findByDate
} = require('../controllers/progress');

router.route('/progress-tasks/:id').get(isAuthenticated, progressTasks); // get task detail of progress
router.route('/progress-attachDiet').post(isAuthenticated, attachDiet); // attach diet to progress
router.route('/progress-attachWorkout').post(isAuthenticated, attachWorkout); // attach workout to progress
router.route('/progress-find/day/:goal/:day').get(isAuthenticated, findByDay); // get progress by goal id and day no
router.route('/progress-find/date/:goal/:date').get(isAuthenticated, findByDate);// get progress by goal id and date

module.exports = router;