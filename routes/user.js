const express = require('express');

const router = express.Router();

const {login, register} = require('../controllers/user.js');
const {isAuthenticated} = require('../middleware/userAuth');

router.route('/user-login').post(login);
router.route('/user-register').post(register);
// router.route('/user-detail').get(isAuthenticated, Profile);
// router.route('/user-delete/:id').delete(isAuthenticated, remove);
// router.route('/user-update/:id').patch(isAuthenticated, update);

module.exports = router;