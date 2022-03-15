const express = require('express');
const router = express.Router();

const {findByID, findByCategory, addIngredient, showIngredients, addCategory, showCategories} = require('../controllers/ingredients');
const {isAuthenticated} = require('../middleware/userAuth');

router.route('/ingredients/id/:id').get(isAuthenticated, findByID);
router.route('/ingredients/category/:category').get(isAuthenticated, findByCategory);
router.route('/ingredients').post(isAuthenticated, addIngredient).get(isAuthenticated, showIngredients);
router.route('/ingredients-category').post(isAuthenticated, addCategory).get(isAuthenticated, showCategories);

module.exports = router;