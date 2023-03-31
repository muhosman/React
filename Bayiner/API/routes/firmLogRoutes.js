const express = require('express');
const firmLogController = require('./../controllers/firmLogController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo(
      'admin',
      'management',
      'manufacture',
      'accounting'
    ),
    firmLogController.getFirmStatistic
  );

router
  .route('/report')
  .get(
    authController.protect,
    authController.restrictTo(
      'admin',
      'management',
      'manufacture',
      'accounting'
    ),
    firmLogController.getFirmLogsforReport
  );

module.exports = router;
