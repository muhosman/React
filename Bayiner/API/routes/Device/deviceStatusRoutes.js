const express = require('express');
const deviceStatusController = require('../../controllers/Device/deviceStatusController');
const authController = require('../../controllers/authController');
const controlParameter = require('../../controllers/controlParameter');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    deviceStatusController.getAllDeviceStatuses
  )
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    controlParameter.restrictTo('name'),
    deviceStatusController.createDeviceStatus
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    deviceStatusController.getDeviceStatus
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    controlParameter.restrictTo('name'),
    deviceStatusController.updateDeviceStatus
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    deviceStatusController.deleteDeviceStatus
  );

module.exports = router;
