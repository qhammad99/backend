const express = require('express');
const router = express.Router();

const {isAuthenticated} = require('../middleware/userAuth');
const {
    myWorkoutPlans,
    workoutPlanByID,
    addWorkoutPlan,
    generalWorkoutPlan,
    workoutPlansByUserID,
    workoutPlanWorkouts
} = require('../controllers/workoutPlan');

router.route('/workoutPlan').get(isAuthenticated, myWorkoutPlans); // my diet plan
router.route('/workoutPlan/:id').get(isAuthenticated, workoutPlanByID); // diet plan by id
router.route('/workoutPlan-add').post(isAuthenticated, addWorkoutPlan); // add diet plan also connect recipies to it
router.route('/workoutPlan-general').get(isAuthenticated, generalWorkoutPlan); // general diet plans
router.route('/workoutPlan-userID/:id').get(isAuthenticated, workoutPlansByUserID); // diet plan by user id
router.route('/workoutPlan-workouts/:id').get(isAuthenticated, workoutPlanWorkouts); // get recipies of that diet

module.exports = router;