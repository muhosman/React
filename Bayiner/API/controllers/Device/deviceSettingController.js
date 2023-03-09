const APIFeatures = require('../../utils/apiFeatures');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const DeviceSetting = require('../../models/Device/deviceSettingModel');

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

exports.getAllDeviceSettings = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(DeviceSetting.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const deviceSettings = await features.query;

  res.status(200).json({
    status: 'success',
    results: deviceSettings.length,
    data: {
      deviceSettings
    }
  });
});

exports.getDeviceSettingByID = catchAsync(async (req, res, next) => {
  const deviceSetting = await DeviceSetting.findOne({
    typeID: req.params.typeID
  });

  if (!deviceSetting) {
    return next(new AppError('No device setting found with that typeID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      deviceSetting
    }
  });
});

exports.getDeviceSetting = catchAsync(async (req, res, next) => {
  const deviceSetting = await DeviceSetting.findById(req.params.id);

  if (!deviceSetting) {
    return next(new AppError('No device setting found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      deviceSetting
    }
  });
});

exports.createDeviceSetting = catchAsync(async (req, res, next) => {
  const newDeviceSetting = await DeviceSetting.create({
    ...req.body,
    createdInfo: dateAndHour(),
    updatedInfo: dateAndHour()
  });

  res.status(201).json({
    status: 'success',
    data: {
      deviceSetting: newDeviceSetting
    }
  });
});
exports.updateDeviceSetting = catchAsync(async (req, res, next) => {
  const deviceSetting = await DeviceSetting.findByIdAndUpdate(
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
  if (!deviceSetting) {
    return next(new AppError('No device setting found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      deviceSetting
    }
  });
});

exports.deleteDeviceSetting = catchAsync(async (req, res, next) => {
  const deviceSetting = await DeviceSetting.findByIdAndDelete(req.params.id);

  if (!deviceSetting) {
    return next(new AppError('No device setting found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: {
      deviceSetting
    }
  });
});
