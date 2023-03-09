const APIFeatures = require('../../utils/apiFeatures');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const City = require('../../models/utils/cityModel');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.getAllCities = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(City.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const cities = await features.query;

  res.status(200).json({
    status: 'succeses',
    results: cities.length,
    data: {
      cities
    }
  });
});

exports.getCity = catchAsync(async (req, res, next) => {
  const city = await City.findById(req.params.id);

  if (!city) {
    return next(new AppError('No product info found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      city
    }
  });
});

exports.createCity = catchAsync(async (req, res, next) => {
  const newcity = await City.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      city: newcity
    }
  });
});

exports.updateCity = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'name');

  const city = await City.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true
  });

  if (!city) {
    return next(new AppError('No product info found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      city
    }
  });
});

exports.deleteCity = catchAsync(async (req, res, next) => {
  const city = await City.findByIdAndDelete(req.params.id);

  if (!city) {
    return next(new AppError('No product info found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
