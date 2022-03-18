const express = require('express');
const router = express.Router();

const {isAuthenticated} = require('../middleware/userAuth');
const {
    myRecipies,
    recipieByID,
    addRecipie,
    renameRecipie, 
    generalRecipies,
    recipiesByUserID,
    recipieIngredients
} = require('../controllers/recipies');

router.route('/recipies').get(isAuthenticated, myRecipies); // my recipies
router.route('/recipies/:id').get(isAuthenticated, recipieByID); // recipie by id
router.route('/recipies-add').post(isAuthenticated, addRecipie) // add recipie also connect ingredients to it.
router.route('/recipies-rename').patch(isAuthenticated, renameRecipie);// rename recipie but if it is general then add new recipie by that user id
router.route('/recipies-general').get(isAuthenticated, generalRecipies); // general recipies where user is admin ID(1)
router.route('/recipies-userID/:id').get(isAuthenticated, recipiesByUserID);    // recipie by user id
router.route('/recipies-ingredients/:id').get(isAuthenticated, recipieIngredients); // get recipie ingredients

module.exports = router;