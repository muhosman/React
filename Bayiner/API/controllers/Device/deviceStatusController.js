const APIFeatures = require('../../utils/apiFeatures');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const DeviceStatus = require('../../models/Device/deviceStatusModel');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
const dateAndHour = function() {
  const currentDate = new Date(Date.now());
  const formattedDate = currentDate.toLocaleString('tr-TR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
  return formattedDate;
};

exports.getAllDeviceStatuses = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(DeviceStatus.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const deviceStatuses = await features.query;

  res.status(200).json({
    status: 'succeses',
    results: deviceStatuses.length,
    data: {
      deviceStatuses
    }
  });
});

exports.getDeviceStatus = catchAsync(async (req, res, next) => {
  const deviceStatus = await DeviceStatus.findById(req.params.id);

  if (!deviceStatus) {
    return next(new AppError('No device status found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      deviceStatus
    }
  });
});

exports.createDeviceStatus = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'name');

  const newDeviceStatus = await DeviceStatus.create({
    ...filteredBody,
    createdInfo: dateAndHour(),
    updatedInfo: dateAndHour()
  });

  res.status(201).json({
    status: 'success',
    data: {
      deviceStatus: newDeviceStatus
    }
  });
});

exports.updateDeviceStatus = catchAsync(async (req, res, next) => {
  const deviceStatus = await DeviceStatus.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      updatedInfo: dateAndHour()
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!deviceStatus) {
    return next(new AppError('No device status found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      deviceStatus
    }
  });
});

exports.deleteDeviceStatus = catchAsync(async (req, res, next) => {
  const deviceStatus = await DeviceStatus.findByIdAndDelete(req.params.id);

  if (!deviceStatus) {
    return next(new AppError('No device status found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
