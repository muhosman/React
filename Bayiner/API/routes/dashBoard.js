const express = require('express');
const dashBoardController = require('../controllers/dashBoardController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'management'),
    dashBoardController.getAllDashBoardDevice
  );

router
  .route('/firstFiveFirms')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'management'),
    dashBoardController.calculateFirstFiveFirms
  );

router
  .route('/generalInfo')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'management'),
    dashBoardController.getGeneralInfo
  );

module.exports = router;
