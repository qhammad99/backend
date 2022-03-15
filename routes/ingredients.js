const express = require('express');
const router = express.Router();

const {isAuthenticated} = require('../middleware/userAuth');
const {
    findByID, 
    findByCategory, 
    addIngredient, 
    showIngredients, 
    addCategory, 
    showCategories
} = require('../controllers/ingredients');

router.route('/ingredients/id/:id').get(isAuthenticated, findByID);
router.route('/ingredients/category/:category').get(isAuthenticated, findByCategory);
router.route('/ingredients').post(isAuthenticated, addIngredient).get(isAuthenticated, showIngredients);
router.route('/ingredients-category').post(isAuthenticated, addCategory).get(isAuthenticated, showCategories);

module.exports = router;