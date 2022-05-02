const express = require('express');
const router = express.Router();

const {
    getMessages
} = require('../controllers/chat.js');
const {isAuthenticated} = require('../middleware/userAuth');

router.route('/get-messages/:sender_id/:reciever_id').get(isAuthenticated, getMessages);

module.exports = router;