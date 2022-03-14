const express = require('express');

const router = express.Router();

const {add, updateStatus} = require('../controllers/goal.js');
const {isAuthenticated} = require('../middleware/userAuth');

router.route('/goal-add').post(isAuthenticated, add);
// router.route('/goal-total').get(isAuthenticated, total);
// router.route('/goal-current').get(isAuthenticated, current);
// router.route('/goal-find/:id').get(isAuthenticated, findGoal);
router.route('/goal-update-status').post(isAuthenticated, updateStatus);
module.exports = router;