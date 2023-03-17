const express = require('express');
const deviceController = require('../../controllers/Device/deviceController');
const authController = require('../../controllers/authController');
const controlParameter = require('../../controllers/controlParameter');

const router = express.Router();

router.route('/test').get(deviceController.test);

router
  .route('/gsm')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    deviceController.getAllGSM
  )
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    deviceController.createGSM
  );
router
  .route('/gsm/:ip')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    deviceController.getGSM
  );

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    deviceController.getAllDevices
  )
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    controlParameter.restrictTo(
      'typeID',
      'name',
      'ip',
      'gsmNo',
      'serialNo',
      'userPassword',
      'adminPassword',
      'quota',
      'counter',
      'settings'
    ),
    deviceController.createDevice
  );

router
  .route('/loadedQuotaToDevice')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    deviceController.generateLoadedQuotaCode
  );

// Update Routes
router
  .route('/updateQuota')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    controlParameter.restrictTo(`productName`, `counter`, `quota`, `id`),
    deviceController.updateQuota
  );

router
  .route('/updateFaultError')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    deviceController.updateFaultorError
  );

router
  .route('/firm/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    controlParameter.restrictTo('firmID'),
    deviceController.updateFirm
  );

router
  .route('/status/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    controlParameter.restrictTo('statusName', 'isActive'),
    deviceController.updateStatus
  );

router
  .route('/ip/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    controlParameter.restrictTo('ip'),
    deviceController.updateIP
  );

router
  .route('/password/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    controlParameter.restrictTo('userPassword', 'adminPassword'),
    deviceController.updatePassword
  );

router
  .route('/note/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    controlParameter.restrictTo('note'),
    deviceController.updateNote
  );

router
  .route('/dowloadSetting/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    deviceController.dowloadSetting
  );

router
  .route('/setting/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    deviceController.getSetting
  )
  .patch(deviceController.updateSetting);

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    deviceController.getDevice
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    controlParameter.controlPassword,
    deviceController.deleteDevice
  );

module.exports = router;
