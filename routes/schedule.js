const express = require('express');
const router = express.Router();

const {isAuthenticated} = require('../middleware/userAuth');
const {
    todaySchedule,
    scheduleByDay,
    addSchedule,
    deleteSchedule,
    updateTime
} = require('../controllers/schedule');

router.route('/schedule-today').post(isAuthenticated, todaySchedule);  // today schedule  // progress table not joined till
router.route('/schedule/day/:day').get(isAuthenticated, scheduleByDay);  // schedule by day
router.route('/schedule-add').post(isAuthenticated, addSchedule);  // add schedule
router.route('/schedule-delete/:id').delete(isAuthenticated, deleteSchedule);  // delete schedule
router.route('/schedule-changeTime').patch(isAuthenticated, updateTime);  // update time

module.exports = router;