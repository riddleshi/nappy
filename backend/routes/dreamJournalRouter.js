const express = require('express');
const router = express.Router();
const dreamJournalCtrl = require('../controllers/dreamJournalCtrl');
const homeController = require('../controllers/homeCtrl'); // for ensureAuthenticated

router.post('/', homeController.ensureAuthenticated, dreamJournalCtrl.addDream);
router.get('/', homeController.ensureAuthenticated, dreamJournalCtrl.getDreams);
router.post('/interpret', homeController.ensureAuthenticated, dreamJournalCtrl.interpretDream);

module.exports = router;