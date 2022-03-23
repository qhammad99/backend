const express = require('express');
const router = express.Router();

const {add, update, myParameters, findParameters} = require('../controllers/parameters.js');
const {isAuthenticated} = require('../middleware/userAuth');

router.route('/parameters-add').post(isAuthenticated, add);
router.route('/parameters-update').post(isAuthenticated, update);
router.route('/parameters-detail').get(isAuthenticated, myParameters);
router.route('/parameters-find/:id').get(isAuthenticated, findParameters);

module.exports = router;