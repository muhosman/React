const express = require('express');
const productInfoController = require('../../controllers/Product/productInfoContoller');
const authController = require('../../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    productInfoController.getAllProductInfoes
  )
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    productInfoController.createProductInfo
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    productInfoController.getProductInfo
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    productInfoController.updateProductInfo
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    productInfoController.deleteProductInfo
  );

module.exports = router;
