const express = require('express');
const router = express.Router();

const {login, register, update, updatePhoto,updatePassword} = require('../controllers/user.js');
const {isAuthenticated} = require('../middleware/userAuth');
const upload = require('../helpers/image-uploader');

router.route('/user-login').post(login);
router.route('/user-register').post(register);
router.route('/user-update').patch(isAuthenticated, update);
router.route('/user-change-password').post(isAuthenticated, updatePassword);
router.route('/user-photo').patch(isAuthenticated, upload.single('photo'), updatePhoto);

module.exports = router;