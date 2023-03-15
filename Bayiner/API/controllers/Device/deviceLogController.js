const Device = require('../../models/Device/deviceModel');
const DeviceLog = require('../../models/Logs/DeviceLogModel');
const APIFeatures = require('../../utils/apiFeatures');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

// getDeviceLogs işlevini tanımlayın
exports.getDeviceLogs = catchAsync(async (req, res, next) => {
  // request body'den verileri çıkarın
  const { createdInfo, data, id } = req.query;

  const parts = createdInfo.split('.');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  const deviceLogs = await DeviceLog.find({
    deviceID: id,
    $or: [
      { 'createdInfo.year': { $gt: year } },
      {
        'createdInfo.year': { $eq: year },
        'createdInfo.month': { $gt: month }
      },
      {
        'createdInfo.year': { $eq: year },
        'createdInfo.month': { $eq: month },
        'createdInfo.day': { $gte: day }
      }
    ]
  });

  if (data === 'consument') {
    // Her saat için tüketimi saklayan bir nesne oluşturun
    const hourlyConsumption = {};
    // Belirtilen tarih aralığındaki tüm logları işleyin
    deviceLogs.forEach(log => {
      log.consument.forEach(consument => {
        const hourKey = consument.createdInfo.time.slice(0, 2);
        if (hourlyConsumption[hourKey]) {
          consument.productInfo.forEach(product => {
            const existingProduct = hourlyConsumption[hourKey].find(
              existing => existing.typeName === product.typeName
            );
            if (existingProduct) {
              existingProduct.quota += product.quota;
            } else {
              hourlyConsumption[hourKey].push(product);
            }
          });
        } else {
          hourlyConsumption[hourKey] = [...consument.productInfo];
        }
      });
    });

    res.status(200).json({
      status: 'success',
      results: Object.keys(hourlyConsumption).length,
      data: hourlyConsumption
    });
  } else if (data === 'fault') {
    res.status(200).json({
      status: 'success',
      data: deviceLogs.fault
    });
  } else if (data === 'error') {
    res.status(200).json({
      status: 'success',
      data: deviceLogs.error
    });
  } else if (data === 'manuelQuotaUpdate') {
    res.status(200).json({
      status: 'success',
      data: deviceLogs.manuelQuotaUpdate
    });
  } else if (data === 'updateInfo') {
    res.status(200).json({
      status: 'success',
      data: deviceLogs.updateInfo
    });
  } else if (data === 'updateSettings') {
    res.status(200).json({
      status: 'success',
      data: deviceLogs.updateSettings
    });
  } else return next(new AppError('No gsm found with that IP', 404));
});
