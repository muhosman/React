const APIFeatures = require('../../utils/apiFeatures');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const DeviceType = require('../../models/Device/deviceTypeModel');

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

exports.getAllDeviceTypes = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(DeviceType.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const deviceTypes = await features.query;

  res.status(200).json({
    status: 'success',
    results: deviceTypes.length,
    data: {
      deviceTypes
    }
  });
});

exports.getDeviceTypeByID = catchAsync(async (req, res, next) => {
  const deviceType = await DeviceType.findOne({ typeID: req.params.typeID });

  if (!deviceType) {
    return next(new AppError('No device type found with that typeID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      deviceType
    }
  });
});

exports.getDeviceType = catchAsync(async (req, res, next) => {
  const deviceType = await DeviceType.findById(req.params.id);

  if (!deviceType) {
    return next(new AppError('No device type found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      deviceType
    }
  });
});

exports.createDeviceType = catchAsync(async (req, res, next) => {
  const newDeviceType = await DeviceType.create({
    ...req.body,
    createdInfo: dateAndHour(),
    updatedInfo: dateAndHour()
  });

  res.status(201).json({
    status: 'success',
    data: {
      deviceType: newDeviceType
    }
  });
});
exports.updateDeviceType = catchAsync(async (req, res, next) => {
  const deviceType = await DeviceType.findByIdAndUpdate(
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
  if (!deviceType) {
    return next(new AppError('No device type found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      deviceType
    }
  });
});

exports.deleteDeviceType = catchAsync(async (req, res, next) => {
  const deviceType = await DeviceType.findByIdAndDelete(req.params.id);

  if (!deviceType) {
    return next(new AppError('No device type found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
