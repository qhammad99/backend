const express = require('express');
const router = express.Router();

const {isAuthenticated} = require('../middleware/userAuth');
const {
    myDietPlans,
    dietPlanByID,
    addDietPlan,
    generalDietPlan,
    dietPlansByUserID,
    dietPlanRecipies
} = require('../controllers/dietPlan');

router.route('/dietPlan').get(isAuthenticated, myDietPlans); // my diet plan
router.route('/dietPlan/:id').get(isAuthenticated, dietPlanByID); // diet plan by id
router.route('/dietPlan-add').post(isAuthenticated, addDietPlan); // add diet plan also connect recipies to it
router.route('/dietPlan-general').get(isAuthenticated, generalDietPlan); // general diet plans
router.route('/dietPlan-userID/:id').get(isAuthenticated, dietPlansByUserID); // diet plan by user id
router.route('/dietPlan-recipies/:id').get(isAuthenticated, dietPlanRecipies); // get recipies of that diet

module.exports = router;