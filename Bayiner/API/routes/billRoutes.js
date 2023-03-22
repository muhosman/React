const express = require('express');
const billController = require('./../controllers/BillController');
const authController = require('./../controllers/authController');
const controlParameter = require('./../controllers/controlParameter');

const router = express.Router();

// router.param('id', deviceSettingController.checkID);

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'management', 'accounting'),
    billController.getAllBills
  )
  .post(
    authController.protect,
    authController.restrictTo('admin', 'management', 'accounting'),
    billController.createBill
  );

router
  .route('/controll')
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'management', 'accounting'),
    billController.controlBill
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'management', 'accounting'),
    billController.getBill
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'management', 'accounting'),
    billController.deleteBill
  );

module.exports = router;
