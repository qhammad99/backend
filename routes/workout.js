const express = require('express');
const router = express.Router();

const {isAuthenticated} = require('../middleware/userAuth');
const {
    findByID, 
    findByCategory, 
    addWorkout, 
    showWorkouts, 
    addCategory, 
    showCategories
} = require('../controllers/workout');

router.route('/workout/id/:id').get(isAuthenticated, findByID);
router.route('/workout/category/:category').get(isAuthenticated, findByCategory);
router.route('/workout').post(isAuthenticated, addWorkout).get(isAuthenticated, showWorkouts);
router.route('/workout-category').post(isAuthenticated, addCategory).get(isAuthenticated, showCategories);

module.exports = router;