const express = require('express');
const stockController = require('./../controllers/stockController');
const authController = require('./../controllers/authController');
const controlParameter = require('./../controllers/controlParameter');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'management', 'manufacture'),
    stockController.getAllStocks
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'management', 'manufacture'),
    stockController.getStock
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'management', 'manufacture'),
    controlParameter.restrictTo('quota'),
    stockController.updateStock
  );

module.exports = router;
