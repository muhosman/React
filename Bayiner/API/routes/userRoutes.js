const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const controlParameter = require('../controllers/controlParameter');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);

router.use(authController.protect);
router.get('/logout', authController.logout);
router.patch(
  '/updateMyPassword',
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
  userController.getMe,
  authController.restrictTo('admin', 'management', 'accounting'),
  userController.getUser
);
router.patch(
  '/updateMe',
  authController.restrictTo('admin', 'management', 'accounting'),
  controlParameter.restrictTo('name', 'lastName', 'tel', 'id'),
  userController.updateMe
);

router
  .route('/playmakers')
  .get(
    authController.restrictTo('admin', 'management', 'accounting'),
    userController.getAllPlayMakers
  );

router
  .route('/')
  .get(
    authController.restrictTo('admin', 'management', 'accounting'),
    userController.getAllUsers
  )
  .post(
    authController.restrictTo('admin', 'management', 'accounting'),
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
    authController.restrictTo('admin', 'management', 'accounting'),
    userController.getUser
  )
  .patch(
    authController.restrictTo('admin', 'management', 'accounting'),
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
    authController.restrictTo('admin'),
    controlParameter.controlPassword,
    userController.deleteUser
  );

module.exports = router;
