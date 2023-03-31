/* eslint-disable prefer-template */
/* eslint-disable prefer-const */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Firm = require('../models/firmModel');
const User = require('./../models/userModel');
const Device = require('./../models/Device/deviceModel');
const FirmLog = require('./../models/Logs/FirmLogModel');
const DashBoardFirmLog = require('./../models/Logs/DashBoardFirmLog');

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

const currentUser = async req => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const user = await User.findById(decoded.id);
  return user;
};

const createOrUpdateFirmLog = async (firm, updateInfo, req) => {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const createdInfo = {
    day,
    month,
    year
  };

  let firmLog = await FirmLog.findOne({
    firmID: firm._id,
    createdInfo: createdInfo
  });

  if (!firmLog) {
    firmLog = await FirmLog.create({
      firmID: firm._id,
      createdInfo: createdInfo,
      name: firm.name,
      mainFirmName: firm.mainFirmName,
      mainFirmID: firm.mainFirmID,
      isCorporate: firm.isCorporate,
      bayserNo: firm.bayserNo,
      officialID: firm.officialID,
      taxNumber: firm.taxNumber,
      taxOffice: firm.taxOffice,
      email: firm.email,
      tel: firm.tel,
      address: firm.address,
      isActive: firm.isActive,
      productInfo: firm.productInfo,
      playMakers: firm.playMakers
    });
  }

  if (updateInfo.length > 0) {
    const user = await currentUser(req);
    const date = `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`;
    const time = `${now.getHours()}:${now.getMinutes()}`;

    firmLog.updateInfo.push({
      userID: user._id,
      name: user.name,
      lastName: user.lastName,
      info: updateInfo,
      createdInfo: {
        date,
        time
      }
    });

    await firmLog.save();
  }

  return firmLog;
};

async function updateDashboardIncludedFirm(newFirm) {
  // Get the current year
  const currentYear = new Date().getFullYear().toString();
  // Get the current day as a string in dd format
  const currentDay = new Date()
    .getDate()
    .toString()
    .padStart(2, '0');
  const month = (new Date().getMonth() + 1).toString();
  const MAX_MONTHLY_LOGS = 6;
  const MAX_WEEKLY_LOGS = 7;

  // Check if there is an existing device log for the current year
  let dashboardFirmLog = await DashBoardFirmLog.findOne({
    main: 'MainDashBoard'
  });

  if (!dashboardFirmLog) {
    dashboardFirmLog = await DashBoardFirmLog.create({
      main: 'MainDashBoard'
    });
  }

  // Check if there is an existing daily log for the current day
  let dailyLog = dashboardFirmLog.dailyInfo;

  if (!dailyLog) {
    dailyLog = {
      date: currentDay,
      includedFirm: [],
      excludedFirm: [],
      includedDevice: []
    };
    dailyLog.includedFirm.push(newFirm);
  } else if (dailyLog.date !== currentDay) {
    // If not, use the daily log as the last day log and create a new daily log
    dashboardFirmLog.lastDayInfo = dailyLog;
    dailyLog = {
      date: currentDay,
      includedFirm: [],
      excludedFirm: [],
      includedDevice: []
    };
    dailyLog.includedFirm.push(newFirm);
  } else {
    // Update the daily consumption value
    dailyLog.includedFirm.push(newFirm);
  }

  // Update the device log with the new values
  dashboardFirmLog.dailyInfo = dailyLog;

  if (dashboardFirmLog.lastWeekInfo.length === 0) {
    dashboardFirmLog.lastWeekInfo.push({
      date: dailyLog.date,
      includedFirm: dailyLog.includedFirm,
      excludedFirm: [],
      includedDevice: []
    });
  } else {
    const dailyLogDate = dailyLog.date;
    const matchingDayIndex = dashboardFirmLog.lastWeekInfo.findIndex(
      weekLog => weekLog.date === dailyLogDate
    );

    if (matchingDayIndex >= 0) {
      dashboardFirmLog.lastWeekInfo[matchingDayIndex].includedFirm.push(
        newFirm
      );
    } else {
      dashboardFirmLog.lastWeekInfo.push({
        date: dailyLogDate,
        includedFirm: dailyLog.includedFirm,
        excludedFirm: [],
        includedDevice: []
      });
      if (dashboardFirmLog.lastWeekInfo.length > MAX_WEEKLY_LOGS) {
        dashboardFirmLog.lastWeekInfo.shift();
      }
    }
  }

  if (!dashboardFirmLog.lastMonthInfo) {
    dashboardFirmLog.lastMonthInfo = {
      date: month,
      includedFirm: dailyLog.includedFirm,
      excludedFirm: [],
      includedDevice: []
    };
  } else if (dashboardFirmLog.lastMonthInfo.date === month) {
    dashboardFirmLog.lastMonthInfo.includedFirm.push(newFirm);
  } else {
    dashboardFirmLog.lastMonthInfo = {
      date: month,
      includedFirm: dailyLog.includedFirm,
      excludedFirm: [],
      includedDevice: []
    };
  }
  // Find the monthly consumption log for the current month
  const monthlyLogIndex = dashboardFirmLog.lastSixMonth.findIndex(
    log => log.date === month
  );

  // If there is an existing monthly consumption log for the current month, update its consumption value
  if (monthlyLogIndex >= 0) {
    dashboardFirmLog.lastSixMonth[monthlyLogIndex].includedFirm.push(newFirm);
  } else {
    // If not, create a new monthly consumption log for the current month
    dashboardFirmLog.lastSixMonth.push({
      date: month,
      includedFirm: dailyLog.includedFirm,
      excludedFirm: [],
      includedDevice: []
    });

    // If there are more than MAX_MONTHLY_LOGS logs, remove the oldest log
    if (dashboardFirmLog.lastSixMonth.length > MAX_MONTHLY_LOGS) {
      dashboardFirmLog.lastSixMonth.shift();
    }
  }

  if (!dashboardFirmLog.lastYearInfo) {
    dashboardFirmLog.lastYearInfo = {
      date: currentYear,
      includedFirm: dailyLog.includedFirm,
      excludedFirm: [],
      includedDevice: []
    };
  } else if (dashboardFirmLog.lastYearInfo.date !== currentYear) {
    dashboardFirmLog.lastYearInfo.date = currentYear;
    dashboardFirmLog.lastYearInfo.includedFirm.push(newFirm);
  } else {
    // Update the last year consumption value
    dashboardFirmLog.lastYearInfo.includedFirm.push(newFirm);
  }

  // Save the updated device log to the database
  await dashboardFirmLog.save();
}

async function updateDashboardExcludedFirm(oldFirm) {
  // Get the current year
  const currentYear = new Date().getFullYear().toString();
  // Get the current day as a string in dd format
  const currentDay = new Date()
    .getDate()
    .toString()
    .padStart(2, '0');
  const month = (new Date().getMonth() + 1).toString();
  const MAX_MONTHLY_LOGS = 6;
  const MAX_WEEKLY_LOGS = 7;

  // Check if there is an existing device log for the current year
  let dashboardFirmLog = await DashBoardFirmLog.findOne({
    main: 'MainDashBoard'
  });

  if (!dashboardFirmLog) {
    dashboardFirmLog = await DashBoardFirmLog.create({
      main: 'MainDashBoard'
    });
  }

  // Check if there is an existing daily log for the current day
  let dailyLog = dashboardFirmLog.dailyInfo;

  if (!dailyLog) {
    dailyLog = {
      date: currentDay,
      includedFirm: [],
      excludedFirm: [],
      includedDevice: []
    };
    dailyLog.excludedFirm.push(oldFirm);
  } else if (dailyLog.date !== currentDay) {
    // If not, use the daily log as the last day log and create a new daily log
    dashboardFirmLog.lastDayInfo = dailyLog;
    dailyLog = {
      date: currentDay,
      includedFirm: [],
      excludedFirm: [],
      includedDevice: []
    };
    dailyLog.excludedFirm.push(oldFirm);
  } else {
    // Update the daily consumption value
    dailyLog.excludedFirm.push(oldFirm);
  }

  // Update the device log with the new values
  dashboardFirmLog.dailyInfo = dailyLog;

  if (dashboardFirmLog.lastWeekInfo.length === 0) {
    dashboardFirmLog.lastWeekInfo.push({
      date: dailyLog.date,
      includedFirm: dailyLog.includedFirm,
      excludedFirm: [],
      includedDevice: []
    });
  } else {
    const dailyLogDate = dailyLog.date;
    const matchingDayIndex = dashboardFirmLog.lastWeekInfo.findIndex(
      weekLog => weekLog.date === dailyLogDate
    );

    if (matchingDayIndex >= 0) {
      dashboardFirmLog.lastWeekInfo[matchingDayIndex].excludedFirm.push(
        oldFirm
      );
    } else {
      dashboardFirmLog.lastWeekInfo.push({
        date: dailyLogDate,
        includedFirm: [],
        excludedFirm: dailyLog.excludedFirm,
        includedDevice: []
      });
      if (dashboardFirmLog.lastWeekInfo.length > MAX_WEEKLY_LOGS) {
        dashboardFirmLog.lastWeekInfo.shift();
      }
    }
  }

  if (!dashboardFirmLog.lastMonthInfo) {
    dashboardFirmLog.lastMonthInfo = {
      date: month,
      includedFirm: [],
      excludedFirm: dailyLog.excludedFirm,
      includedDevice: []
    };
  } else if (dashboardFirmLog.lastMonthInfo.date === month) {
    dashboardFirmLog.lastMonthInfo.excludedFirm.push(oldFirm);
  } else {
    dashboardFirmLog.lastMonthInfo = {
      date: month,
      includedFirm: [],
      excludedFirm: dailyLog.excludedFirm,
      includedDevice: []
    };
  }
  // Find the monthly consumption log for the current month
  const monthlyLogIndex = dashboardFirmLog.lastSixMonth.findIndex(
    log => log.date === month
  );

  // If there is an existing monthly consumption log for the current month, update its consumption value
  if (monthlyLogIndex >= 0) {
    dashboardFirmLog.lastSixMonth[monthlyLogIndex].excludedFirm.push(oldFirm);
  } else {
    // If not, create a new monthly consumption log for the current month
    dashboardFirmLog.lastSixMonth.push({
      date: month,
      includedFirm: [],
      excludedFirm: dailyLog.excludedFirm,
      includedDevice: []
    });

    // If there are more than MAX_MONTHLY_LOGS logs, remove the oldest log
    if (dashboardFirmLog.lastSixMonth.length > MAX_MONTHLY_LOGS) {
      dashboardFirmLog.lastSixMonth.shift();
    }
  }

  if (!dashboardFirmLog.lastYearInfo) {
    dashboardFirmLog.lastYearInfo = {
      date: currentYear,
      includedFirm: [],
      excludedFirm: dailyLog.excludedFirm,
      includedDevice: []
    };
  } else if (dashboardFirmLog.lastYearInfo.date !== currentYear) {
    dashboardFirmLog.lastYearInfo.date = currentYear;
    dashboardFirmLog.lastYearInfo.excludedFirm.push(oldFirm);
  } else {
    // Update the last year consumption value
    dashboardFirmLog.lastYearInfo.excludedFirm.push(oldFirm);
  }

  // Save the updated device log to the database
  await dashboardFirmLog.save();
}

const validateRequestBody = (req, next) => {
  const { quotaWarning, quotaMax, syncLevel } = req.body;
  if (
    quotaWarning === undefined ||
    quotaMax === undefined ||
    syncLevel === undefined
  ) {
    return next(
      new AppError(
        'Please provide quotaWarning, quotaMax, and syncLevel in the request body',
        400
      )
    );
  }
  return { quotaWarning, quotaMax, syncLevel };
};

const updateDeviceProductInfo = async (
  devices,
  productToUpdate,
  { quotaWarning, quotaMax, syncLevel }
) => {
  const updatePromises = devices.map(async device => {
    const productToUpdateDevice = device.productInfo.find(
      product => product.productName === productToUpdate.productName
    );

    if (productToUpdateDevice !== undefined) {
      productToUpdateDevice.quotaWarning = quotaWarning;
      productToUpdateDevice.quotaMax = quotaMax;
      productToUpdateDevice.syncLevel = syncLevel;

      return device.save();
    }
  });

  await Promise.all(updatePromises);
};

const createUpdateInfo = (initialValue, updatedValues) => {
  const { quotaWarning, quotaMax, syncLevel } = updatedValues;
  const updateInfo = [];

  if (initialValue.quotaWarning !== quotaWarning) {
    updateInfo.push({
      infoName: 'Tehlikei Kota',
      valueFrom: initialValue.quotaWarning,
      valueTo: quotaWarning
    });
  }

  if (initialValue.quotaMax !== quotaMax) {
    updateInfo.push({
      infoName: 'Maksimum Kota',
      valueFrom: initialValue.quotaMax,
      valueTo: quotaMax
    });
  }

  if (initialValue.syncLevel !== syncLevel) {
    updateInfo.push({
      infoName: 'Senkronizasyon Seviyesi',
      valueFrom: initialValue.syncLevel,
      valueTo: syncLevel
    });
  }

  return updateInfo;
};
const getTotalQuotaAndDeviceCount = async (firmID, productName) => {
  const devices = await Device.find({
    firmID,
    statusName: 'Firma',
    isActive: true
  });

  let totalQuota = 0;
  let numDevices = 0;

  devices.forEach(device => {
    const productInfo = device.productInfo.find(
      product => product.productName === productName
    );

    if (productInfo) {
      totalQuota += productInfo.quota;
      numDevices += 1;
    }
  });

  return { totalQuota, numDevices };
};

const findDeviceProductInfo = (device, productName) => {
  return device.productInfo.find(
    product => product.productName === productName
  );
};

const updateDeviceProductQuota = async (device, productName, newQuota) => {
  const productInfo = findDeviceProductInfo(device, productName);
  if (productInfo) {
    productInfo.quota = newQuota;
    await device.save();
  }
};
const getActiveDevices = async firmID => {
  return await Device.find({
    firmID,
    statusName: 'Firma',
    isActive: true
  });
};

function arraysDiffer(initialArray, updatedArray) {
  const differences = [];

  // Handle added elements
  updatedArray.forEach(updatedItem => {
    const initialItem = initialArray.find(item => item.id === updatedItem.id);

    if (!initialItem) {
      differences.push({
        action: 'added',
        infoName: 'Plasiyer',
        valueFrom: 'null',
        valueTo: updatedItem.name + ' ' + updatedItem.lastName
      });
    }
  });

  // Handle removed elements
  initialArray.forEach(initialItem => {
    const updatedItem = updatedArray.find(item => item.id === initialItem.id);

    if (!updatedItem) {
      differences.push({
        action: 'removed',
        infoName: 'Plasiyer',
        valueFrom: initialItem.name + ' ' + initialItem.lastName,
        valueTo: 'null'
      });
    }
  });

  return differences;
}
function compareAndUpdateFirmObjects(initialFirm, updatedFirm, req) {
  const allowedKeys = [
    'name',
    'isCorporate',
    'mainFirmID',
    'mainFirmName',
    'officialID',
    'taxNumber',
    'taxOffice',
    'email',
    'tel',
    'address',
    'isActive',
    'playMakers'
  ];

  const initialFirmObj = initialFirm.toObject();
  const updatedFirmObj = updatedFirm.toObject();
  const updateInfo = [];

  for (const key in initialFirmObj) {
    if (allowedKeys.includes(key) && key !== 'updateInfo') {
      if (key === 'address') {
        for (const subKey in initialFirmObj[key]) {
          if (initialFirmObj[key][subKey] !== updatedFirmObj[key][subKey]) {
            updateInfo.push({
              infoName: 'Adres',
              valueFrom: initialFirmObj[key][subKey],
              valueTo: updatedFirmObj[key][subKey]
            });
          }
        }
      } else if (key === 'playMakers') {
        const differences = arraysDiffer(
          initialFirmObj[key],
          updatedFirmObj[key]
        );

        if (differences.length > 0) {
          differences.forEach(diff => {
            updateInfo.push(diff);
          });
        }
      } else if (initialFirmObj[key] !== updatedFirmObj[key]) {
        updateInfo.push({
          infoName:
            key === 'isCorporate'
              ? 'Ana Firma'
              : key === 'mainFirmName'
              ? 'Bağlı Ana Firma'
              : key === 'officialID'
              ? 'TC No'
              : key === 'taxNumber'
              ? 'Vergi Numarası'
              : key === 'taxOffice'
              ? 'Vergi Dairesi'
              : key === 'email'
              ? 'Email'
              : key === 'tel'
              ? 'Telefon'
              : 'Firma ID',
          valueFrom: initialFirmObj[key],
          valueTo: updatedFirmObj[key]
        });
      }
    }
  }

  return updateInfo;
}

exports.getAllFirms = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Firm.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const Firms = await features.query;

  res.status(200).json({
    status: 'success',
    results: Firms.length,
    data: {
      Firms
    }
  });
});

exports.getDeviceByFirmID = catchAsync(async (req, res, next) => {
  const devices = await Device.find({ firmID: req.params.id });

  if (!devices) {
    return next(new AppError('No device service found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    results: devices.length,
    data: {
      devices
    }
  });
});

exports.getFirmByID = catchAsync(async (req, res, next) => {
  const firm = await Firm.findById(req.params.id);

  if (!firm) {
    return next(new AppError('No device service found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    results: firm.length,
    data: {
      firm
    }
  });
});

exports.getBelowFirmsByID = catchAsync(async (req, res, next) => {
  const firms = await Firm.find({ mainFirmID: req.params.id });

  if (!firms) {
    return next(new AppError('No device service found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    results: firms.length,
    data: {
      firms
    }
  });
});

exports.getUsersByFirmID = catchAsync(async (req, res, next) => {
  const users = await User.find({ firmID: req.params.id });
  if (!users) {
    return next(new AppError('No user found with that Firm ID', 404));
  }

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

exports.getFirmSyncSettingsByID = catchAsync(async (req, res, next) => {
  const firm = await Firm.findById(req.params.id);

  if (!firm) {
    return next(new AppError('No firm found with that ID', 404));
  }
  const Devices = await Device.find({ firmID: firm._id });

  const quotaArray = [];

  // eslint-disable-next-line no-shadow, array-callback-return
  Devices.map(Device => {
    // eslint-disable-next-line array-callback-return
    Device.productInfo.map(item => {
      const existingQuota = quotaArray.find(
        arr => arr.name === item.productName
      );
      if (existingQuota) {
        existingQuota.quota += item.quota;
      } else {
        quotaArray.push({ name: item.productName, quota: item.quota });
      }
    });
  });

  res.status(200).json({
    status: 'success',
    data: {
      productInfoes: firm.productInfo,
      quotaArray: quotaArray
    }
  });
});

exports.getFirmQuota = catchAsync(async (req, res, next) => {
  const firm = await Firm.findById(req.params.id);

  if (!firm) {
    return next(new AppError('No firm found with that ID', 404));
  }
  const Devices = await Device.find({ firmID: firm._id });

  const quotaArray = [];

  // eslint-disable-next-line no-shadow, array-callback-return
  Devices.map(Device => {
    // eslint-disable-next-line array-callback-return
    Device.productInfo.map(item => {
      const existingQuota = quotaArray.find(
        arr => arr.name === item.productName
      );
      if (existingQuota) {
        existingQuota.quota += item.quota;
      } else {
        quotaArray.push({ name: item.productName, quota: item.quota });
      }
    });
  });
  res.status(200).json({
    status: 'success',
    results: quotaArray.length,
    data: {
      quotaArray: quotaArray
    }
  });
});

exports.updateFirmSyncSetting = catchAsync(async (req, res, next) => {
  const firm = await Firm.findById(req.params.id);

  if (!firm) {
    return next(new AppError('No firm found with that ID', 404));
  }

  const productToUpdate = firm.productInfo.find(
    product => product.productName === req.body.productName
  );

  if (!productToUpdate) {
    return next(new AppError('No product found with that firm', 404));
  }

  const devices = await Device.find({ firmID: firm._id });

  if (!devices) {
    return next(new AppError('No devices found with this firmID', 404));
  }

  const { quotaWarning, quotaMax, syncLevel } = validateRequestBody(req, next);

  const initialValue = {
    quotaWarning: productToUpdate.quotaWarning,
    quotaMax: productToUpdate.quotaMax,
    syncLevel: productToUpdate.syncLevel
  };

  await updateDeviceProductInfo(devices, productToUpdate, {
    quotaWarning,
    quotaMax,
    syncLevel
  });

  productToUpdate.quotaWarning = req.body.quotaWarning;
  productToUpdate.quotaMax = req.body.quotaMax;
  productToUpdate.syncLevel = req.body.syncLevel;

  await firm.save();

  const updateInfo = createUpdateInfo(initialValue, req.body);
  if (updateInfo.length > 0) {
    await createOrUpdateFirmLog(firm, updateInfo, req);
  }

  res.status(200).json({
    status: 'success'
  });
});

exports.divideFirmQuotaToDevice = catchAsync(async (req, res, next) => {
  const firmID = req.params.id;
  const { productName } = req.body;

  const firm = await Firm.findById(firmID);

  if (!firm) {
    return next(new AppError('No firm found with that id', 404));
  }

  const indexFirm = firm.productInfo.findIndex(
    product => product.productName === productName
  );

  if (indexFirm === -1) {
    return next(new AppError('No firm found with that product name', 404));
  }

  // Burada cihazlara bağlanmalı
  let { totalQuota, numDevices } = await getTotalQuotaAndDeviceCount(
    firmID,
    productName
  );

  const perDeviceQuota = Math.ceil(totalQuota / numDevices);

  if (perDeviceQuota < 30) {
    return next(
      new AppError('The total quota that you want to divide is very low', 404)
    );
  }

  const devices = await getActiveDevices(firmID, productName);

  // burada da cihazlara bağlanıp kotalarını dağıtmalı
  for (const device of devices) {
    if (totalQuota <= perDeviceQuota) {
      await updateDeviceProductQuota(device, productName, totalQuota);
      totalQuota = 0;
    } else {
      await updateDeviceProductQuota(device, productName, perDeviceQuota);
      totalQuota -= perDeviceQuota;
    }
  }

  firm.productInfo[indexFirm].quota = totalQuota;
  await firm.save();

  res.status(200).json({
    status: 'success'
  });
});

exports.createFirm = catchAsync(async (req, res, next) => {
  const firms = await Firm.find({});
  const usedNumbers = new Set(
    firms.map(firm => {
      // eslint-disable-next-line radix
      const number = parseInt(firm.bayserNo);
      // eslint-disable-next-line no-restricted-globals
      return isNaN(number) ? 0 : number;
    })
  );
  let maxBayserNo = -Infinity;
  if (usedNumbers.size > 0) {
    maxBayserNo = Math.max(...usedNumbers);
  }
  let newBayserNo = 1;
  for (let i = 1; i <= maxBayserNo + 1; i += 1) {
    if (!usedNumbers.has(i)) {
      newBayserNo = i;
      break;
    }
  }
  const filteredBody = filterObj(req.body, 'isCorporate', 'mainFirmID');

  if (filteredBody.isCorporate === false && req.body.mainFirmID) {
    const firm = await Firm.create({
      ...req.body,
      bayserNo: newBayserNo,
      createdInfo: dateAndHour(),
      updatedInfo: dateAndHour()
    });
    const newFirm = { id: firm._id, name: firm.name };
    await updateDashboardIncludedFirm(newFirm);
  } else if (filteredBody.isCorporate === true && !req.body.mainFirmID) {
    const filteredObj = filterObj(
      req.body,
      'name',
      'isCorporate',
      'officialID',
      'taxNumber',
      'taxOffice',
      'email',
      'tel',
      'address'
    );

    const firm = await Firm.create({
      ...filteredObj,
      bayserNo: newBayserNo,
      createdInfo: dateAndHour(),
      updatedInfo: dateAndHour()
    });
    const newFirm = { id: firm._id, name: firm.name };
    await updateDashboardIncludedFirm(newFirm);
  } else
    return next(new AppError('Mainfirm ID and isCorporate not proper.', 404));

  res.status(201).json({
    status: 'success'
  });
});

exports.updateFirmInfo = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'isCorporate', 'mainFirmID');

  const initialFirm = await Firm.findById(req.params.id);

  let updatedFirm;

  if (filteredBody.isCorporate === true) {
    const playMakersWithDetails = await Promise.all(
      req.body.playMakers.map(async playMakerId => {
        const playMakerUser = await User.findById(playMakerId.id);
        return {
          id: playMakerUser._id,
          name: playMakerUser.name,
          lastName: playMakerUser.lastName
        };
      })
    );

    const filteredObj = filterObj(
      {
        ...req.body,
        playMakers: playMakersWithDetails
      },
      'name',
      'isCorporate',
      'officialID',
      'taxNumber',
      'taxOffice',
      'email',
      'tel',
      'address',
      'isActive',
      'playMakers',
      'note'
    );

    updatedFirm = await Firm.findByIdAndUpdate(
      req.params.id,
      {
        ...filteredObj,
        mainFirmID: '',
        mainFirmName: '',
        updatedInfo: dateAndHour()
      },
      {
        new: true,
        runValidators: true
      }
    );
  } else {
    updatedFirm = await Firm.findByIdAndUpdate(
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
  }

  if (updatedFirm.playMakers && updatedFirm.playMakers.length > 0) {
    await Promise.all(
      updatedFirm.playMakers.map(async playMaker => {
        await User.findByIdAndUpdate(
          playMaker.id,
          {
            $addToSet: {
              firms: { firmID: updatedFirm._id, firmName: updatedFirm.name }
            }
          },
          {
            new: true,
            runValidators: true
          }
        );
      })
    );
  }

  if (initialFirm.isActive !== updatedFirm.isActive) {
    if (updatedFirm.isActive === false) {
      const oldFirm = { id: updatedFirm._id, name: updatedFirm.name };
      await updateDashboardExcludedFirm(oldFirm);
    } else if (updatedFirm.isActive === true) {
      const newFirm = { id: updatedFirm._id, name: updatedFirm.name };
      await updateDashboardIncludedFirm(newFirm);
    }
  }

  // Fonksiyonu çağırarak kullanma
  const updateInfo = compareAndUpdateFirmObjects(initialFirm, updatedFirm, req);

  // Call createOrUpdateFirmLog function with the updated information
  if (updateInfo.length > 0) {
    await createOrUpdateFirmLog(updatedFirm, updateInfo, req);
  }

  res.status(200).json({
    status: 'success'
  });
});

exports.deleteFirm = catchAsync(async (req, res, next) => {
  const firm = await Firm.findById(req.params.id);
  const mainFirm = await Firm.findOne({ bayserNo: '1' });
  if (!firm) {
    return next(new AppError('No firm found with that ID', 404));
  }
  if (!mainFirm) {
    return next(new AppError('No main firm found with that ID', 404));
  }
  if (firm.isActive === true || firm.bayserNo === 1) {
    return next(
      new AppError(
        'You can not delete firm bayserNo is one or it is active firm',
        404
      )
    );
  }

  await Device.updateMany(
    { firmID: req.params.id },
    { $set: { firmID: mainFirm._id } }
  );
  const deletedFirm = await Firm.findByIdAndDelete(req.params.id);

  if (!deletedFirm) {
    return next(new AppError('No firm found with that ID', 404));
  }

  await Firm.updateMany(
    { mainFirmID: req.params.id },
    { $set: { mainFirmID: '', mainFirmName: '', isCorporate: true } }
  );

  res.status(204).json({
    status: 'success'
  });
});
