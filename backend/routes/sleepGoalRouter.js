const express = require('express');
const router = express.Router();
const sleepGoalCtrl = require('../controllers/sleepGoalCtrl');
const homeController = require('../controllers/homeCtrl'); // import here

router.get('/', homeController.ensureAuthenticated, sleepGoalCtrl.getSleepGoal);
router.post('/', homeController.ensureAuthenticated, sleepGoalCtrl.updateSleepGoal);

module.exports = router;