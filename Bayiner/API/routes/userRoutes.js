const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const controlParameter = require('../controllers/controlParameter');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);

router.get('/logout', authController.protect, authController.logout);
router.patch(
  '/updateMyPassword',
  authController.protect,
  controlParameter.restrictTo(
    'passwordCurrent',
    'password',
    'passwordConfirm',
    'id'
  ),
  authController.updatePassword
);
router.get(
  '/me',
  authController.protect,
  userController.getMe,
  authController.restrictTo('admin'),
  userController.getUser
);
router.patch(
  '/updateMe',
  authController.protect,
  authController.restrictTo('admin'),
  controlParameter.restrictTo('name', 'lastName', 'tel', 'id'),
  userController.updateMe
);

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getAllUsers
  )
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    controlParameter.restrictTo(
      'name',
      'lastName',
      'email',
      'tel',
      'firmID',
      'firmName',
      'role'
    ),
    userController.createUser
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getUser
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    controlParameter.restrictTo(
      'name',
      'lastName',
      'email',
      'tel',
      'firmID',
      'firmName',
      'role',
      'isActive'
    ),
    userController.updateUser
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    controlParameter.controlPassword,
    userController.deleteUser
  );

module.exports = router;
