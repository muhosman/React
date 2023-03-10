const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const DashBoardDevice = require('./../models/Logs/DashBoardDeviceLog');

exports.getAllDashBoardDevice = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(DashBoardDevice.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const dashBoardDevices = await features.query;

  res.status(200).json({
    status: 'success',
    results: dashBoardDevices.length,
    data: {
      dashBoardDevices
    }
  });
});
