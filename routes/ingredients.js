const express = require('express');
const router = express.Router();

const {isAuthenticated} = require('../middleware/userAuth');
const {
    findByID, 
    findByCategory, 
    addIngredient, 
    showIngredients, 
    addCategory, 
    showCategories,
    updatePrice
} = require('../controllers/ingredients');
const upload = require('../helpers/ingredient-image');

router.route('/ingredients/id/:id').get(isAuthenticated, findByID);
router.route('/ingredients/category/:category').get(isAuthenticated, findByCategory);
router.route('/ingredients').patch(isAuthenticated, upload.single('photo'), addIngredient).get(isAuthenticated, showIngredients);
router.route('/ingredients-category').post(isAuthenticated, addCategory).get(isAuthenticated, showCategories);
router.route('/ingredient/update').post(isAuthenticated, updatePrice);

module.exports = router;