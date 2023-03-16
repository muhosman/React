const express = require('express');
const deviceLogController = require('../../controllers/Device/deviceLogController');
const authController = require('../../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    deviceLogController.getDeviceLogs
  );

router
  .route('/report')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    deviceLogController.getDeviceLogsforReport
  );

module.exports = router;
