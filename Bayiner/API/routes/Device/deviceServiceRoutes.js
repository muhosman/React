const express = require('express');
const deviceServiceController = require('../../controllers/Device/deviceServiceController');
const authController = require('../../controllers/authController');
const controlParameter = require('../../controllers/controlParameter');

const router = express.Router();

// router.param('id', deviceServiceController.checkID);

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    deviceServiceController.getAllDeviceServices
  )
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    controlParameter.restrictTo(
      'type',
      'serviceCode',
      'info',
      'deviceSettingID',
      'solutionStep',
      'note'
    ),
    deviceServiceController.createDeviceService
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    deviceServiceController.getDeviceService
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    controlParameter.restrictTo(
      'type',
      'serviceCode',
      'info',
      'deviceSettingID',
      'solutionStep',
      'note'
    ),
    deviceServiceController.updateDeviceService
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    deviceServiceController.deleteDeviceService
  );

module.exports = router;
