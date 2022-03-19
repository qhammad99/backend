const express = require('express');
const router = express.Router();

const {isAuthenticated} = require('../middleware/userAuth');
const {
    todaySchedule,
    scheduleByDay
} = require('../controllers/schedule');

router.route('/schedule-today').get(isAuthenticated, todaySchedule) // today schedule  // progress table not joined till
router.route('/schedule/day/:day').get(isAuthenticated, scheduleByDay)  // schedule by day
// add schedule
// delete schedule
// update time
module.exports = router;