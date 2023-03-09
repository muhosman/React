const APIFeatures = require('../../utils/apiFeatures');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const DeviceService = require('../../models/Device/deviceServiceModel');

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

exports.getAllDeviceServices = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(DeviceService.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const DeviceServices = await features.query;

  res.status(200).json({
    status: 'success',
    results: DeviceServices.length,
    data: {
      DeviceServices
    }
  });
});

exports.getDeviceService = catchAsync(async (req, res, next) => {
  const deviceService = await DeviceService.findById(req.params.id);

  if (!deviceService) {
    return next(new AppError('No device service found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      deviceService
    }
  });
});

exports.createDeviceService = catchAsync(async (req, res, next) => {
  const newDeviceService = await DeviceService.create({
    ...req.body,
    createdInfo: dateAndHour(),
    updatedInfo: dateAndHour()
  });

  res.status(201).json({
    status: 'success',
    data: {
      deviceService: newDeviceService
    }
  });
});

exports.updateDeviceService = catchAsync(async (req, res, next) => {
  const deviceService = await DeviceService.findByIdAndUpdate(
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

  if (!deviceService) {
    return next(new AppError('No device service found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      deviceService
    }
  });
});

exports.deleteDeviceService = catchAsync(async (req, res, next) => {
  const deviceService = await DeviceService.findByIdAndDelete(req.params.id);

  if (!deviceService) {
    return next(new AppError('No device service found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
