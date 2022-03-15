const express = require('express');
const router = express.Router();

const {addCategory, showCategories} = require('../controllers/workout');
const {isAuthenticated} = require('../middleware/userAuth');

router.route('/workout-category').post(isAuthenticated, addCategory).get(isAuthenticated, showCategories);

module.exports = router;