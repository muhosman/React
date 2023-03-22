const express = require('express');
const dashBoardController = require('./../controllers/dashBoardController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'management'),
    dashBoardController.getAllDashBoardDevice
  );

module.exports = router;
