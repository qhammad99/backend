const express = require('express');

const router = express.Router();

const {login, register, update} = require('../controllers/user.js');
const {isAuthenticated} = require('../middleware/userAuth');

router.route('/user-login').post(login);
router.route('/user-register').post(register);
router.route('/user-update/:id').patch(isAuthenticated, update);

module.exports = router;