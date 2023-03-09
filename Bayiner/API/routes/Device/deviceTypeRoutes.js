const express = require('express');
const deviceTypeController = require('../../controllers/Device/deviceTypeController');
const authController = require('../../controllers/authController');
const controlParameter = require('../../controllers/controlParameter');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    deviceTypeController.getAllDeviceTypes
  )
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    controlParameter.restrictTo('name', 'settingType'),
    deviceTypeController.createDeviceType
  );

router
  .route('/:typeID')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    deviceTypeController.getDeviceTypeByID
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    deviceTypeController.getDeviceType
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    controlParameter.restrictTo('name', 'settingType'),
    deviceTypeController.updateDeviceType
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    deviceTypeController.deleteDeviceType
  );

module.exports = router;
