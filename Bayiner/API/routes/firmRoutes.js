const express = require('express');
const firmController = require('../controllers/firmController');
const authController = require('../controllers/authController');
const controlParameter = require('../controllers/controlParameter');

const router = express.Router();

// router.param('id', deviceServiceController.checkID);

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    firmController.getAllFirms
  )
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    controlParameter.restrictTo(
      'name',
      'mainFirmID',
      'mainFirmName',
      'isCorporate',
      'officialID',
      'taxNumber',
      'taxOffice',
      'email',
      'tel',
      'address'
    ),
    firmController.createFirm
  );

router
  .route('/belowFirms/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    firmController.getBelowFirmsByID
  );

router
  .route('/devices/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    controlParameter.restrictTo(),
    firmController.getDeviceByFirmID
  );

router
  .route('/sync/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    controlParameter.restrictTo(),
    firmController.getFirmSyncSettingsByID
  );

router
  .route('/belongUsers/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    firmController.getUsersByFirmID
  );
router
  .route('/updateSync/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    controlParameter.restrictTo(
      'productName',
      'quota',
      'quotaWarning',
      'quotaMax',
      'syncLevel'
    ),
    firmController.updateFirmSyncSetting
  );

router
  .route('/divideQuota/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    controlParameter.restrictTo('productName'),
    firmController.divideFirmQuotaToDevice
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    firmController.getFirmByID
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    controlParameter.controlPassword,
    firmController.deleteFirm
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    controlParameter.restrictTo(
      'name',
      'mainFirmID',
      'mainFirmName',
      'isCorporate',
      'officialID',
      'taxNumber',
      'taxOffice',
      'email',
      'tel',
      'address',
      'isActive',
      'playMakers',
      'note'
    ),
    firmController.updateFirmInfo
  );

module.exports = router;
