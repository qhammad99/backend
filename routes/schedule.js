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
const upload = require('../helpers/schedule-image');

router.route('/schedule-today').post(isAuthenticated, todaySchedule);  // today schedule 
router.route('/schedule/day/:day').get(isAuthenticated, scheduleByDay);  // schedule by day
router.route('/schedule-add').patch(isAuthenticated, upload.single('photo'), addSchedule);  // add schedule
router.route('/schedule-delete/:id').delete(isAuthenticated, deleteSchedule);  // delete schedule
router.route('/schedule-changeTime').patch(isAuthenticated, updateTime);  // update time

module.exports = router;