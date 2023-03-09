const APIFeatures = require('../../utils/apiFeatures');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const Town = require('../../models/utils/townModel');

exports.getAllTowns = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Town.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const towns = await features.query;

  res.status(200).json({
    status: 'succeses',
    results: towns.length,
    data: {
      towns
    }
  });
});

exports.getTown = catchAsync(async (req, res, next) => {
  const town = await Town.findById(req.params.id);

  if (!town) {
    return next(new AppError('No product info found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      town
    }
  });
});

exports.createTown = catchAsync(async (req, res, next) => {
  const newtown = await Town.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      town: newtown
    }
  });
});

exports.updateTown = catchAsync(async (req, res, next) => {
  const town = await Town.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!town) {
    return next(new AppError('No product info found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      town
    }
  });
});

exports.deleteTown = catchAsync(async (req, res, next) => {
  const town = await Town.findByIdAndDelete(req.params.id);

  if (!town) {
    return next(new AppError('No product info found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
