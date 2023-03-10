const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const DashBoardDevice = require('./../models/Logs/DashBoardDeviceLog');
const Device = require('./../models/Device/deviceModel');

exports.getAllDashBoardDevice = catchAsync(async (req, res, next) => {
  const featuresDashBoardDevice = new APIFeatures(
    DashBoardDevice.find(),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const featuresDevice = new APIFeatures(Device.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const devices = await featuresDevice.query;

  const dashBoardDevices = await featuresDashBoardDevice.query;

  res.status(200).json({
    status: 'success',
    results: dashBoardDevices.length,
    data: {
      dashBoardDevices,
      devices
    }
  });
});
