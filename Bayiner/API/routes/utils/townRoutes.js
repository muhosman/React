const express = require('express');
const townController = require('../../controllers/utils/townController');
const authController = require('../../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    townController.getAllTowns
  )
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    townController.createTown
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    townController.getTown
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    townController.updateTown
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    townController.deleteTown
  );

module.exports = router;
