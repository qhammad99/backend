const express = require('express');
const router = express.Router();

const {
    availableCoachs,
    coachDetail, 
    coachClients, 
    coachInfoByID,
    addCoachInfo,
    coachFindByName,
    changeStatus
} = require('../controllers/coach.js');
const {isAuthenticated} = require('../middleware/userAuth');

router.route('/coach-all').get(isAuthenticated, availableCoachs);
router.route('/coach-detail').get(isAuthenticated, coachDetail); //agr coach walay table sy rec nai mila to mtlb us ny detail signup nai ki
router.route('/coach-clients').get(isAuthenticated, coachClients);
router.route('/coach-info/:id').get(isAuthenticated, coachInfoByID);
router.route('/coach-detail-add').post(isAuthenticated, addCoachInfo);
router.route('/coach-find/:name').get(isAuthenticated, coachFindByName); // search krny k liay
router.route('/coach-status-update').patch(isAuthenticated, changeStatus);

module.exports = router;