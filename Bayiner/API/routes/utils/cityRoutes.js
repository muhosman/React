const express = require('express');
const cityController = require('../../controllers/utils/cityController');
const authController = require('../../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    cityController.getAllCities
  )
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    cityController.createCity
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    cityController.getCity
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    cityController.updateCity
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    cityController.deleteCity
  );

module.exports = router;
