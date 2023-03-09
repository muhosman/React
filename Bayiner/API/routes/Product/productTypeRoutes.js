const express = require('express');
const productTypeController = require('../../controllers/Product/productTypeController');
const authController = require('../../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    productTypeController.getAllProductTypes
  )
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    productTypeController.createProductType
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    productTypeController.getProductType
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    productTypeController.updateProductType
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    productTypeController.deleteProductType
  );

module.exports = router;
