const catchAsync = require('./../utils/catchAsync');
const Test = require('./../models/testModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.getTest = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Test.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tests = await features.query;

  res.status(201).json({
    status: 'success',
    results: tests.length,
    data: {
      tests
    }
  });
});

exports.createTest = catchAsync(async (req, res, next) => {
  const newTest = await Test.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      gsmInfo: newTest
    }
  });
});

exports.updateTest = catchAsync(async (req, res, next) => {
  await Test.findByIdAndUpdate(req.params.id);

  res.status(201).json({
    status: 'success'
  });
});
