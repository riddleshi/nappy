const express = require('express')
const homeRouter = express.Router()
const homeController = require('../controllers/homeCtrl')


homeRouter.post('/home/sleeplogs', homeController.ensureAuthenticated, homeController.addSleepLog);
homeRouter.get('/home/sleeplogs',  homeController.ensureAuthenticated, homeController.getSleepLogs);

module.exports = homeRouter