const express = require('express');
const testController = require('./../controllers/testController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/').get(testController.getTest);

router.route('/').post(testController.createTest);

router.route('/:id').patch(testController.updateTest);

module.exports = router;
