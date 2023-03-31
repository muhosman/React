const Firm = require('./../models/firmModel');
const FirmLog = require('./../models/Logs/FirmLogModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// getDeviceLogs işlevini tanımlayın
exports.getFirmStatistic = catchAsync(async (req, res, next) => {
  // request body'den verileri çıkarın
  const { createdInfo, id } = req.query;

  const parts = createdInfo.split('.');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  const faultCounter = {};
  const errorCounter = {};

  const device = await Firm.findOne({ _id: id });
  if (!device) return next(new AppError('No device found with that id', 404));

  // Cihazdaki tüm ürün tiplerini alın
  const allProducts = device.productInfo.map(product => product.productName);

  const firmLogs = await FirmLog.find({
    firmID: id,
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
  if (!firmLogs)
    return next(new AppError('No firmLogs found with that info', 404));

  // Her saat için tüketimi saklayan bir nesne oluşturun
  const hourlyConsumption = {};

  // Belirtilen tarih aralığındaki tüm logları işleyin
  firmLogs.forEach(log => {
    log.fault.forEach(fault => {
      if (!faultCounter[fault.faultCode]) {
        faultCounter[fault.faultCode] = {
          faultName: fault.faultName,
          counter: 1
        };
      } else {
        faultCounter[fault.faultCode].counter += 1;
      }
    });

    log.error.forEach(error => {
      if (!errorCounter[error.errorCode]) {
        errorCounter[error.errorCode] = {
          errorName: error.errorName,
          counter: 1
        };
      } else {
        errorCounter[error.errorCode].counter += 1;
      }
    });

    log.consument.forEach(consument => {
      const hourKey = consument.createdInfo.time.slice(0, 5);

      if (!hourlyConsumption[hourKey]) {
        hourlyConsumption[hourKey] = allProducts.map(productName => ({
          typeName: productName,
          quota: 0
        }));
      }

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
    });
  });
  // Saat dilimlerini düzgün bir şekilde sıralayın
  const sortedHourlyConsumption = Object.entries(hourlyConsumption)
    .sort((a, b) => {
      const timeA = a[0].split(':').map(x => parseInt(x, 10));
      const timeB = b[0].split(':').map(x => parseInt(x, 10));

      if (timeA[0] < timeB[0] || (timeA[0] === timeB[0] && timeA[1] < timeB[1]))
        return -1;
      if (timeA[0] > timeB[0] || (timeA[0] === timeB[0] && timeA[1] > timeB[1]))
        return 1;
      return 0;
    })
    .reduce((accumulator, [hour, consumption]) => {
      accumulator[hour] = consumption;
      return accumulator;
    }, {});

  // Sayaçları diziye dönüştürün
  const faultsArray = Object.entries(faultCounter).map(
    ([faultCode, { faultName, counter }]) => ({
      faultCode,
      faultName,
      counter
    })
  );

  const errorsArray = Object.entries(errorCounter).map(
    ([errorCode, { errorName, counter }]) => ({
      errorCode,
      errorName,
      counter
    })
  );

  res.status(200).json({
    status: 'success',
    results: Object.keys(sortedHourlyConsumption).length,
    consumption: sortedHourlyConsumption,
    faults: faultsArray,
    errors: errorsArray
  });
});

exports.getFirmLogsforReport = catchAsync(async (req, res, next) => {
  // request body'den verileri çıkarın
  const { createdInfo, createdInfoSecond, data, id } = req.query;

  const parts1 = createdInfo.split('.');
  const day1 = parseInt(parts1[0], 10);
  const month1 = parseInt(parts1[1], 10); // Months are zero-based in JavaScript Date
  const year1 = parseInt(parts1[2], 10);

  const parts2 = createdInfoSecond.split('.');
  const day2 = parseInt(parts2[0], 10);
  const month2 = parseInt(parts2[1], 10); // Months are zero-based in JavaScript Date
  const year2 = parseInt(parts2[2], 10);

  const firmLogs = await FirmLog.find({
    deviceID: id,
    $and: [
      {
        $or: [
          { 'createdInfo.year': { $gt: year1 } },
          {
            'createdInfo.year': { $eq: year1 },
            'createdInfo.month': { $gt: month1 }
          },
          {
            'createdInfo.year': { $eq: year1 },
            'createdInfo.month': { $eq: month1 },
            'createdInfo.day': { $gte: day1 }
          }
        ]
      },
      {
        $or: [
          { 'createdInfo.year': { $lt: year2 } },
          {
            'createdInfo.year': { $eq: year2 },
            'createdInfo.month': { $lt: month2 }
          },
          {
            'createdInfo.year': { $eq: year2 },
            'createdInfo.month': { $eq: month2 },
            'createdInfo.day': { $lte: day2 }
          }
        ]
      }
    ]
  });

  if (!firmLogs)
    return next(new AppError('No deviceLogs found with that info', 404));

  let filteredLogs = [];

  if (data === 'consument') {
    filteredLogs = firmLogs.map(log => log.consument);
  } else if (data === 'fault') {
    filteredLogs = firmLogs.map(log => log.fault);
  } else if (data === 'error') {
    filteredLogs = firmLogs.map(log => log.error);
  } else if (data === 'updateInfo') {
    filteredLogs = firmLogs.map(log => log.updateInfo);
  } else if (data === 'updateBill') {
    filteredLogs = firmLogs.map(log => log.updateBill);
  }

  // Flatten the filteredLogs array and sort by createdInfo.date
  const sortedLogs = filteredLogs.flat().sort((a, b) => {
    const aDate = new Date(a.createdInfo.date);
    const bDate = new Date(b.createdInfo.date);
    return aDate - bDate;
  });

  // Group logs by date
  const groupedLogs = sortedLogs.reduce((accumulator, log) => {
    const dateKey = log.createdInfo.date.split('T')[0];
    if (!accumulator[dateKey]) {
      accumulator[dateKey] = {
        date: dateKey,
        logs: []
      };
    }
    accumulator[dateKey].logs.push(log);
    return accumulator;
  }, {});

  // Convert groupedLogs object to an array
  const logsArray = Object.values(groupedLogs);

  res.status(200).json({
    status: 'success',
    results: logsArray.length,
    data: logsArray
  });
});
