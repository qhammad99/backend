const express = require('express');
const router = express.Router();

const {
    clientsCoach,
    deleteCoach,
    addClientsCoach, 
    giveRating,
    updatePayment
} = require('../controllers/client.js');
const {isAuthenticated} = require('../middleware/userAuth');

router.route('/client-coach').get(isAuthenticated, clientsCoach); // check have coach or not or expired
router.route('/client-coach').delete(isAuthenticated, deleteCoach); // delete coach
router.route('/client-coach').post(isAuthenticated, addClientsCoach); // add coach and new payment
router.route('/client-rating').patch(isAuthenticated, giveRating); // give rating to coach
router.route('/client-payment-update').patch(isAuthenticated, updatePayment); // update payment

module.exports = router;