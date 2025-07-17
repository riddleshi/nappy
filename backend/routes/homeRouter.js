const express = require('express')
const homeRouter = express.Router()
const homeController = require('../controllers/homeCtrl')


homeRouter.post('/sleeplogs', homeController.ensureAuthenticated, homeController.addSleepLog);
homeRouter.get('/sleeplogs',  homeController.ensureAuthenticated, homeController.getSleepLogs);

module.exports = homeRouter