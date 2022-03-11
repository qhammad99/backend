const express = require('express');
const bodyParser = require('body-parser');

//controlers import
const userInfoController=require('../controllers/userInfo.js');

const router = express.Router();

router.get('/', userInfoController.getUsersInfo);
router.post('/login', userInfoController.getUserInfo);
router.post('/signup', userInfoController.addUserInfo);
// router.delete('/:id', removeUserInfo);
// router.patch('/:id', jsonParser, updateUserInfo);

module.exports = router;