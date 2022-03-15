const express = require('express');
const router = express.Router();

const {addCategory, showCategories} = require('../controllers/ingredients');
const {isAuthenticated} = require('../middleware/userAuth');

router.route('/ingredients-category').post(isAuthenticated, addCategory).get(isAuthenticated, showCategories);

module.exports = router;