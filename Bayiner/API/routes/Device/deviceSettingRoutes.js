const express = require('express');
const deviceSettingController = require('../../controllers/Device/deviceSettingController');
const authController = require('../../controllers/authController');
const controlParameter = require('../../controllers/controlParameter');

const router = express.Router();

// router.param('id', deviceSettingController.checkID);

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    deviceSettingController.getAllDeviceSettings
  )
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    controlParameter.restrictTo(
      'name',
      'productName',
      'quota',
      'quotaMax',
      'quotaWarning',
      'syncLevel',
      'cupSettingRow',
      'generalSettingRow'
    ),
    deviceSettingController.createDeviceSetting
  );

router
  .route('/:typeID')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    deviceSettingController.getDeviceSettingByID
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    deviceSettingController.getDeviceSetting
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    controlParameter.restrictTo(
      'name',
      'productName',
      'quota',
      'quotaMax',
      'quotaWarning',
      'syncLevel',
      'price',
      'cupSettingRow',
      'generalSettingRow'
    ),
    deviceSettingController.updateDeviceSetting
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    deviceSettingController.deleteDeviceSetting
  );

module.exports = router;
