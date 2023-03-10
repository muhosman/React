const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../../models/userModel');
const Device = require('../../models/Device/deviceModel');
const GSM = require('../../models/gsmModel');
const Firm = require('../../models/firmModel');
const DeviceType = require('../../models/Device/deviceTypeModel');
const DeviceSetting = require('../../models/Device/deviceSettingModel');
const DeviceLog = require('../../models/Logs/DeviceLogModel');
const DashBoardDeviceLog = require('../../models/Logs/DashBoardDeviceLog');
const APIFeatures = require('../../utils/apiFeatures');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
function currentDate() {
  const date = new Date();
  const formattedDate = `${date
    .getDate()
    .toString()
    .padStart(2, '0')}.${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}.${date.getFullYear()} ${date
    .getHours()
    .toString()
    .padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
  return formattedDate;
}

function dateFunc() {
  const today = new Date();
  return `${today
    .getDate()
    .toString()
    .padStart(2, '0')}.${(today.getMonth() + 1)
    .toString()
    .padStart(2, '0')}.${today.getFullYear().toString()}`;
}
function timeFunc() {
  const today = new Date();
  return `${today
    .getHours()
    .toString()
    .padStart(2, '0')}:${today
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
}

const createDeviceLog = (device, date) => {
  return new DeviceLog({
    deviceID: device._id,
    name: device.name,
    statusName: device.statusName,
    firmID: device.firmID,
    firmName: device.firmName,
    ip: device.ip,
    imei: device.imei,
    gsmNo: device.gsmNo,
    serialNo: device.serialNo,
    userPassword: device.userPassword,
    adminPassword: device.adminPassword,
    settings: device.settings,
    productInfo: device.productInfo,
    isActive: device.isActive,
    note: device.note,
    lastConnectionDate: device.lastConnectionDate,
    createdInfo: date
  });
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

const updateInfoLog = async (device, changedValues, req) => {
  const user = await currentUser(req);

  const updateLog = {
    userID: user.id,
    name: user.name,
    lastName: user.lastName,
    info: changedValues,
    createdInfo: {
      date: dateFunc(),
      time: timeFunc()
    }
  };

  let deviceLog = await DeviceLog.findOne({
    deviceID: device._id,
    createdInfo: dateFunc()
  });

  let updateInfo = [];
  if (!deviceLog) {
    deviceLog = createDeviceLog(device, dateFunc());
    await deviceLog.save();
  } else {
    updateInfo = deviceLog.updateInfo;
  }
  updateInfo.push(updateLog);
  deviceLog.updateInfo = updateInfo;
  await deviceLog.save();
};

exports.getAllDevices = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Device.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const devices = await features.query;

  res.status(200).json({
    status: 'success',
    results: devices.length,
    data: {
      devices
    }
  });
});

exports.getAllGSM = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(GSM.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const gsmInfos = await features.query;

  res.status(201).json({
    status: 'success',
    results: gsmInfos.length,
    data: {
      gsmInfos
    }
  });
});

exports.test = catchAsync(async (req, res, next) => {
  res.status(201).json('Test Başarılı');
});

exports.createGSM = catchAsync(async (req, res, next) => {
  const newGSM = await GSM.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      gsmInfo: newGSM
    }
  });
});
exports.getGSM = catchAsync(async (req, res, next) => {
  const gsmInfo = await GSM.findOne({ ip: req.params.ip });

  if (!gsmInfo) {
    return next(new AppError('No gsm found with that IP', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      gsmInfo
    }
  });
});

exports.getDevice = catchAsync(async (req, res, next) => {
  const device = await Device.findById(req.params.id);

  if (!device) {
    return next(new AppError('No device found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      device
    }
  });
});

exports.createDevice = catchAsync(async (req, res, next) => {
  const gsmInfo = await GSM.findOne({ ip: req.body.ip });
  const firm = await Firm.findOne({ bayserNo: '1' });
  const deviceType = await DeviceType.findById(req.body.typeID);

  if (!deviceType) {
    return next(new AppError('No device type found with that typeID', 404));
  }
  if (!firm) {
    return next(new AppError('No firm found with that bayserNo', 404));
  }
  if (!gsmInfo) {
    return next(new AppError('No gsm found with that IP', 404));
  }

  const { deviceSettingIds, cupNumbers } = deviceType.settingType.reduce(
    (acc, setting) => {
      acc.deviceSettingIds.push(setting.settingID);
      acc.cupNumbers.push(setting.cupNumber);
      return acc;
    },
    { deviceSettingIds: [], cupNumbers: [] }
  );

  const deviceSettings = await DeviceSetting.find({
    _id: { $in: deviceSettingIds }
  });

  const productInfo = [];

  const settings = deviceSettings.map((item, index) => {
    const { cupSettingRow, generalSettingRow, name } = item;
    const value = new Array(
      cupNumbers[index] * cupSettingRow.length + generalSettingRow.length
    ).fill('0');

    const product = {
      productName: item.productName,
      quota: item.quota,
      counter: 0,
      quotaWarning: item.quotaWarning,
      quotaMax: item.quotaMax,
      syncLevel: item.syncLevel
    };

    productInfo.push(product);

    return {
      cupNumber: cupNumbers[index],
      name: name,
      cupSettingRow: cupSettingRow,
      generalSettingRow: generalSettingRow,
      value: value
    };
  });

  firm.updatedInfo = currentDate();

  await firm.save();

  const device = await Device.create({
    name: deviceType.name,
    firmID: firm._id,
    firmName: firm.name,
    statusName: 'Depo',
    ip: gsmInfo.ip,
    imei: gsmInfo.imei,
    gsmNo: gsmInfo.gsmNo,
    serialNo: gsmInfo.serialNo,
    userPassword: req.body.userPassword,
    adminPassword: req.body.adminPassword,
    settings: settings,
    productInfo: productInfo,
    lastConnectionDate: currentDate(),
    updatedInfo: currentDate(),
    createdInfo: currentDate()
  });

  // eslint-disable-next-line no-restricted-syntax
  for (const deviceProductInfo of device.productInfo) {
    const matchingFirmProductInfoIndex = firm.productInfo.findIndex(
      firmProductInfo =>
        firmProductInfo.productName === deviceProductInfo.productName
    );

    if (matchingFirmProductInfoIndex === -1) {
      // Product info not found in firm's product info array, so add it
      firm.productInfo.push({
        productName: deviceProductInfo.productName,
        quota: 0,
        quotaWarning: deviceProductInfo.quotaWarning,
        quotaMax: deviceProductInfo.quotaMax,
        syncLevel: deviceProductInfo.syncLevel
      });
    } else {
      // Product info found in firm's product info array, so update it
      const matchingFirmProductInfo =
        firm.productInfo[matchingFirmProductInfoIndex];
      deviceProductInfo.quota = matchingFirmProductInfo.quota;
      deviceProductInfo.quotaMax = matchingFirmProductInfo.quotaMax;
      deviceProductInfo.quotaWarning = matchingFirmProductInfo.quotaWarning;
      deviceProductInfo.syncLevel = matchingFirmProductInfo.syncLevel;
    }
  }

  gsmInfo.settings = req.body.settings;
  await gsmInfo.save();
  await firm.save();

  res.status(201).json({
    status: 'success'
  });
});

exports.updateIP = catchAsync(async (req, res, next) => {
  const gsmInfo = await GSM.findOne({ ip: req.body.ip });

  if (!gsmInfo) {
    return next(new AppError('No gsm found with that IP', 404));
  }

  const device = await Device.findByIdAndUpdate(
    req.params.id,
    {
      ip: gsmInfo.ip,
      imei: gsmInfo.imei,
      gsmNo: gsmInfo.gsmNo,
      serialNo: gsmInfo.serialNo,
      updatedInfo: currentDate()
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!device) {
    return next(new AppError('No device found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      updatedInfo: currentDate()
    }
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const device = await Device.findById(req.params.id);
  if (!device) {
    return next(new AppError('There are no device with this id ', 404));
  }
  if (
    device.userPassword === req.body.userPassword &&
    device.adminPassword === req.body.adminPassword
  ) {
    return next(new AppError('Password is not changed', 404));
  }
  try {
    const oldUserPassword = device.userPassword;
    const oldAdminPassword = device.adminPassword;

    await Device.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedInfo: currentDate() },
      {
        new: true,
        runValidators: true
      }
    );

    const changedValues = [];
    if (oldUserPassword !== req.body.userPassword) {
      changedValues.push({
        infoName: 'Kullanıcı Şifresi',
        valueFrom: oldUserPassword,
        valueTo: req.body.userPassword
      });
    }
    if (oldAdminPassword !== req.body.adminPassword) {
      changedValues.push({
        infoName: 'Admin Şifresi',
        valueFrom: oldAdminPassword,
        valueTo: req.body.adminPassword
      });
    }

    await updateInfoLog(device, changedValues, req);

    res.status(200).json({
      status: 'success'
    });
  } catch (err) {
    return next(new AppError('Error updating device password ', 500));
  }
});

exports.updateNote = catchAsync(async (req, res, next) => {
  const device = await Device.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedInfo: currentDate() },
    {
      new: true,
      runValidators: true
    }
  );

  if (!device) {
    return next(new AppError('No device found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      updatedInfo: currentDate()
    }
  });
});

exports.updateFirm = catchAsync(async (req, res, next) => {
  const device = await Device.findById(req.params.id);

  if (!device) {
    return next(new AppError('No device found with that ID', 404));
  }
  if (device.firmID === req.body.firmID) {
    return next(new AppError('You can not assign device to its firm', 404));
  }

  const firm = await Firm.findById(device.firmID); // Current firm of the device
  const bayiner = await Firm.findOne({ bayserNo: 1 }); // System firm
  const targetFirm = await Firm.findById(req.body.firmID);

  if (!firm || !bayiner || !targetFirm) {
    return next(new AppError('No firm found with that ID', 404));
  }
  if (firm._id === targetFirm._id) {
    return next(new AppError('No firm found with that ID', 404));
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const deviceProductInfo of device.productInfo) {
    const matchingFirmProductInfo = firm.productInfo.find(
      firmProductInfo =>
        firmProductInfo.productName === deviceProductInfo.productName
    );
    if (matchingFirmProductInfo) {
      // Update quota of matching product info in firm
      matchingFirmProductInfo.quota += deviceProductInfo.quota;
    }
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const deviceProductInfo of device.productInfo) {
    const matchingFirmProductInfoIndex = targetFirm.productInfo.findIndex(
      firmProductInfo =>
        firmProductInfo.productName === deviceProductInfo.productName
    );

    if (matchingFirmProductInfoIndex === -1) {
      // Product info not found in firm's product info array, so add it
      targetFirm.productInfo.push({
        productName: deviceProductInfo.productName,
        quota: 0,
        quotaWarning: deviceProductInfo.quotaWarning,
        quotaMax: deviceProductInfo.quotaMax,
        syncLevel: deviceProductInfo.syncLevel
      });
      deviceProductInfo.quota = 0;
    } else {
      // Product info found in firm's product info array, so update it
      const matchingFirmProductInfo =
        targetFirm.productInfo[matchingFirmProductInfoIndex];
      deviceProductInfo.quota = 0;
      deviceProductInfo.quotaMax = matchingFirmProductInfo.quotaMax;
      deviceProductInfo.quotaWarning = matchingFirmProductInfo.quotaWarning;
      deviceProductInfo.syncLevel = matchingFirmProductInfo.syncLevel;
    }
  }

  const firmDevices = await Device.find({ firmID: firm._id });
  const deviceProductNames = new Set();

  // Collect all product names from the firm's devices except for the device being removed
  // eslint-disable-next-line no-restricted-syntax
  for (const firmDevice of firmDevices) {
    if (firmDevice._id.toString() !== device._id.toString()) {
      // eslint-disable-next-line no-restricted-syntax
      for (const productInfo of firmDevice.productInfo) {
        deviceProductNames.add(productInfo.productName);
      }
    }
  }

  // Remove product info objects for product names not present in any of the firm's devices
  firm.productInfo = firm.productInfo.filter(productInfo =>
    deviceProductNames.has(productInfo.productName)
  );

  device.firmID = targetFirm._id;
  device.firmName = targetFirm.name;
  device.updatedInfo = currentDate();
  firm.updatedInfo = currentDate();
  targetFirm.updatedInfo = currentDate();

  try {
    await device.save();
    await firm.save();
    await targetFirm.save();

    const changedValues = [
      {
        infoName: 'Firma',
        valueFrom: firm.name,
        valueTo: targetFirm.name
      }
    ];
    await updateInfoLog(device, changedValues, req);

    res.status(200).json({
      status: 'success'
    });
  } catch (err) {
    return next(new AppError('Error updating device firm', 500));
  }
});

exports.updateStatus = catchAsync(async (req, res, next) => {
  const device = await Device.findById(req.params.id);
  if (!device) {
    return next(new AppError('No device found with that ID', 404));
  }
  const firm = await Firm.findById(device.firmID); // Current firm of the device

  if (!firm) {
    return next(new AppError('No firm found with that ID', 404));
  }

  if (
    device.statusName === req.body.statusName &&
    device.isActive === req.body.isActive
  ) {
    return next(new AppError('Status name or activity is same', 404));
  }

  if (
    (device.statusName === 'Firma' ||
      req.body.statusName === 'Firma' ||
      req.body.isActive === false) &&
    (device.statusName !== req.body.statusName ||
      device.isActive !== req.body.isActive)
  ) {
    // eslint-disable-next-line no-restricted-syntax
    for (const deviceProductInfo of device.productInfo) {
      const matchingFirmProductInfoIndex = firm.productInfo.findIndex(
        firmProductInfo =>
          firmProductInfo.productName === deviceProductInfo.productName
      );

      if (matchingFirmProductInfoIndex !== -1) {
        const matchingFirmProductInfo =
          firm.productInfo[matchingFirmProductInfoIndex];

        matchingFirmProductInfo.quota += deviceProductInfo.quota;
        deviceProductInfo.quota = 0;
        deviceProductInfo.quotaMax = matchingFirmProductInfo.quotaMax;
        deviceProductInfo.quotaWarning = matchingFirmProductInfo.quotaWarning;
        deviceProductInfo.syncLevel = matchingFirmProductInfo.syncLevel;
      }
    }
  }

  const oldActivity = device.isActive;
  const oldStatusName = device.statusName;

  device.isActive = req.body.isActive;
  device.statusName = req.body.statusName;
  device.updatedInfo = currentDate();
  firm.updatedInfo = currentDate();

  try {
    await device.save();
    await firm.save();

    const changedValues = [];
    if (oldActivity !== req.body.isActive) {
      changedValues.push({
        infoName: 'Aktiflik',
        valueFrom: oldActivity ? 'Aktif' : 'Pasif',
        valueTo: req.body.isActive ? 'Aktif' : 'Pasif'
      });
    }
    if (oldStatusName !== req.body.statusName) {
      changedValues.push({
        infoName: 'Konum',
        valueFrom: oldStatusName,
        valueTo: req.body.statusName
      });
    }

    await updateInfoLog(device, changedValues, req);

    res.status(200).json({
      status: 'success'
    });
  } catch (err) {
    return next(new AppError('Error updating device status and activity', 500));
  }
});

const getChanges = (oldSetting, newSetting, req) => {
  const cupLength = oldSetting.cupSettingRow.length;
  const cupNumber = oldSetting.cupNumber;
  const generalLength = oldSetting.generalSettingRow.length;
  const valueLength = cupNumber * cupLength + generalLength;

  const changedValues = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < valueLength; i++) {
    const oldValue = oldSetting.value[i];
    const newValue = newSetting.value[i];
    if (oldValue !== newValue) {
      let infoName;
      let position;
      let settingType;
      if (i < cupNumber * cupLength) {
        const cupIndex = Math.floor(i / cupNumber);
        infoName = oldSetting.cupSettingRow[cupIndex];
        settingType = 'Göz Ayarı';
        position = (i % cupNumber) + 1;
      } else {
        const generalIndex = i - cupNumber * cupLength;
        infoName = oldSetting.generalSettingRow[generalIndex];
        settingType = 'Genel Ayar';
        position = 1 + i - cupNumber * cupLength;
      }

      changedValues.push({
        settingType,
        position,
        infoName,
        valueFrom: oldValue,
        valueTo: newValue
      });
    }
  }

  return changedValues;
};

exports.updateSetting = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'settings');
  const device = await Device.findById(req.params.id);

  if (!device) {
    return next(new AppError('No device found with that ID', 404));
  }

  if (
    JSON.stringify(device.settings) === JSON.stringify(filteredBody.settings)
  ) {
    return next(new AppError('No changes made to the settings', 400));
  }

  const changedValues = [];

  device.settings.forEach((oldSetting, index) => {
    const newSetting = filteredBody.settings[index];
    if (JSON.stringify(oldSetting) !== JSON.stringify(newSetting)) {
      const values = getChanges(oldSetting, newSetting, device, req);
      changedValues.push(...values);
    }
  });

  await Device.findByIdAndUpdate(
    req.params.id,
    {
      settings: req.body.settings,
      updatedInfo: currentDate()
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (changedValues.length > 0) {
    const user = await currentUser(req);

    const updateLog = {
      userID: user.id,
      name: user.name,
      lastName: user.lastName,
      setting: changedValues,
      createdInfo: {
        date: dateFunc(),
        time: timeFunc()
      }
    };

    let deviceLog = await DeviceLog.findOne({
      deviceID: device._id,
      createdInfo: dateFunc()
    });

    let updateSettings = [];

    if (!deviceLog) {
      deviceLog = createDeviceLog(device, dateFunc());
      await deviceLog.save();
    } else {
      updateSettings = deviceLog.updateSettings;
    }
    updateSettings.push(updateLog);
    deviceLog.updateSettings = updateSettings;
    await deviceLog.save();
  }

  res.status(200).json({
    status: 'success'
  });
});

const createConsumentLog = async (device, productName, quota) => {
  const date = dateFunc();
  const time = timeFunc();

  let consument = [];

  let deviceLog = await DeviceLog.findOne({
    deviceID: device._id,
    createdInfo: dateFunc()
  });

  if (!deviceLog) {
    deviceLog = createDeviceLog(device, date);
  } else {
    consument = deviceLog.consument;
  }
  const consumentLog = {
    productInfo: [
      {
        typeName: productName,
        quota: quota
      }
    ],
    firmID: device.firmID,
    firmName: device.firmName,
    createdInfo: {
      date: date,
      time: time
    }
  };
  consument.push(consumentLog);
  deviceLog.consument = consument;
  await deviceLog.save();
};

async function updateDashboard({ consumption, productName }) {
  // Get the current year
  const currentYear = new Date().getFullYear().toString();
  // Get the current day as a string in dd format
  const currentDay = new Date()
    .getDate()
    .toString()
    .padStart(2, '0');
  const month = new Date().getMonth().toString();
  const MAX_MONTHLY_LOGS = 6;
  const MAX_WEEKLY_LOGS = 7;

  // Check if there is an existing device log for the current year
  let deviceLog = await DashBoardDeviceLog.findOne({
    productName: productName
  });

  if (!deviceLog) {
    deviceLog = await DashBoardDeviceLog.create({ productName: productName });
    await deviceLog.save();
  }

  // Check if there is an existing daily log for the current day
  let dailyLog = deviceLog.dailyInfo;

  if (!dailyLog) {
    dailyLog = {
      date: currentDay,
      consumption: consumption
    };
  } else if (dailyLog.date !== currentDay) {
    // If not, use the daily log as the last day log and create a new daily log
    deviceLog.lastDayInfo = dailyLog;
    dailyLog = {
      date: currentDay,
      consumption: consumption
    };
  } else {
    // Update the daily consumption value
    dailyLog.consumption += consumption;
  }

  // Update the device log with the new values
  deviceLog.dailyInfo = dailyLog;
  if (deviceLog.lastWeekInfo.length === 0) {
    deviceLog.lastWeekInfo.push({
      date: dailyLog.date,
      consumption: dailyLog.consumption
    });
  } else {
    const dailyLogDate = dailyLog.date;
    const matchingDayIndex = deviceLog.lastWeekInfo.findIndex(
      weekLog => weekLog.date === dailyLogDate
    );

    console.log(matchingDayIndex);
    if (matchingDayIndex >= 0) {
      deviceLog.lastWeekInfo[matchingDayIndex].consumption += consumption;
    } else {
      deviceLog.lastWeekInfo.push({
        date: dailyLogDate,
        consumption: dailyLog.consumption
      });
      if (deviceLog.lastWeekInfo.length > MAX_WEEKLY_LOGS) {
        deviceLog.lastWeekInfo.shift();
      }
    }
  }

  if (!deviceLog.lastMonthInfo) {
    deviceLog.lastMonthInfo = {
      date: month,
      consumption: consumption
    };
  } else if (deviceLog.lastMonthInfo.date === month) {
    deviceLog.lastMonthInfo.consumption += consumption;
  } else {
    deviceLog.lastMonthInfo = {
      date: month,
      consumption: consumption
    };
  }

  // Find the monthly consumption log for the current month
  const monthlyLogIndex = deviceLog.lastSixMonthConsumption.findIndex(
    log => log.monthName === month
  );

  // If there is an existing monthly consumption log for the current month, update its consumption value
  if (monthlyLogIndex >= 0) {
    deviceLog.lastSixMonthConsumption[
      monthlyLogIndex
    ].consumption += consumption;
  } else {
    // If not, create a new monthly consumption log for the current month
    deviceLog.lastSixMonthConsumption.push({
      monthName: month,
      consumption: consumption
    });

    // If there are more than MAX_MONTHLY_LOGS logs, remove the oldest log
    if (deviceLog.lastSixMonthConsumption.length > MAX_MONTHLY_LOGS) {
      deviceLog.lastSixMonthConsumption.shift();
    }
  }

  if (!deviceLog.lastYearInfo) {
    deviceLog.lastYearInfo = { date: currentYear, consumption: consumption };
  } else if (deviceLog.lastYearInfo.date !== currentYear) {
    deviceLog.lastYearInfo.date = currentYear;
    deviceLog.lastYearInfo.consumption = consumption;
  } else {
    // Update the last year consumption value
    deviceLog.lastYearInfo.consumption += consumption;
  }

  // Save the updated device log to the database
  await deviceLog.save();
}

exports.updateQuota = catchAsync(async (req, res, next) => {
  const { productName, counter, quota, id } = req.body;

  const device = await Device.findById(id);

  if (!device) {
    return next(new AppError('There are no device with this id', 404));
  }

  const productInfoIndex = device.productInfo.findIndex(
    info => info.productName === productName
  );

  if (productInfoIndex === -1) {
    return next(new AppError('There are no product with this name', 404));
  }

  //const alreadyQuota = device.productInfo[productInfoIndex].quota;
  //const alreadyCounter = device.productInfo[productInfoIndex].counter;

  /*
  if (counter > alreadyCounter && quota < alreadyQuota) {
    return next(new AppError('There is no consumption', 404));
  }
  if (counter - alreadyCounter === quota - alreadyQuota) {
    return next(new AppError('Unconvenient parameter', 404));
  }
  */
  const beforeQuota = device.productInfo[productInfoIndex].quota;
  if (device.productInfo[productInfoIndex].quota >= quota) {
    device.productInfo[productInfoIndex].counter += quota;
    device.productInfo[productInfoIndex].quota -= quota;
    await device.save();
    await createConsumentLog(device, productName, quota);
  }

  if (
    device.productInfo[productInfoIndex].syncLevel >=
      device.productInfo[productInfoIndex].quota &&
    device.productInfo[productInfoIndex].syncLevel <= beforeQuota
  ) {
    // Firmayı bulun
    const firm = await Firm.findById(device.firmID);

    if (firm) {
      // Tüm cihazlardaki ürün bilgisi dizilerini alın
      const productInfoArrays = await Device.find({
        firmID: device.firmID,
        statusName: 'Firma',
        isActive: true
      }).distinct('productInfo');

      if (productInfoArrays) {
        // Toplam kotayı hesaplayın
        let totalQuota = 0;
        let numDevices = 0;

        for (let i = 0; i < productInfoArrays.length; i += 1) {
          if (productName === productInfoArrays[i].productName) {
            totalQuota += productInfoArrays[i].quota;
            numDevices += 1;
          }
        }

        const firmProductInfo = firm.productInfo;
        let indexFirm = -1;
        for (let i = 0; i < firmProductInfo.length; i += 1) {
          // eslint-disable-next-line no-plusplus
          if (firmProductInfo[i].productName === productName) {
            totalQuota += firmProductInfo[i].quota;
            indexFirm = i;
            break;
          }
        }

        if (indexFirm !== -1) {
          // Her cihaz için eşit dağıtılacak kotayı hesaplayın
          const perDeviceQuota = Math.ceil(totalQuota / numDevices);

          if (perDeviceQuota > 30) {
            // Tüm cihazların ürün bilgisi dizilerini alın
            const devices = await Device.find({
              firmID: device.firmID,
              statusName: 'Firma',
              isActive: true
            });
            // Tüm cihazların ürün bilgisi dizilerindeki productName'e sahip olanların kotayı eşit dağıtın
            // eslint-disable-next-line no-shadow
            devices.forEach(device => {
              const productInfo = device.productInfo.find(
                product => product.productName === productName
              );

              if (productInfo) {
                if (totalQuota <= perDeviceQuota) {
                  // son cihazın kotayı toplam kota ile doldur
                  productInfo.quota = totalQuota;
                  totalQuota = 0;
                } else {
                  // diğer cihazlara perDeviceQuota kadar kota ver
                  productInfo.quota = perDeviceQuota;
                  totalQuota -= perDeviceQuota;
                }
                device.save();
              }
            });

            firm.productInfo[indexFirm].quota = totalQuota;
            await firm.save();
          }
        }
      }
    }
  }

  await updateDashboard({ consumption: quota, productName: productName });

  res.status(200).json({
    status: 'success',
    message: 'Quota updated successfully'
  });
});

exports.dowloadSetting = catchAsync(async (req, res, next) => {
  const device = await Device.findById(req.params.id);
  const gsmInfo = await GSM.findOne({ ip: device.ip });

  const { settings } = gsmInfo.settings;

  if (!settings || !device) {
    return next(new AppError('No setting found with that ID', 404));
  }

  device.settings = settings;
  await device.save();
  res.status(200).json({
    status: 'success',
    data: {
      settings
    }
  });
});

exports.getSetting = catchAsync(async (req, res, next) => {
  const device = await Device.findById(req.params.id);
  const setting = device.settings;
  if (!setting || !device) {
    return next(new AppError('No setting found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      setting,
      updatedInfo: currentDate()
    }
  });
});

const deleteLog = async (device, req) => {
  const user = await currentUser(req);

  const deleteInfo = {
    userID: user.id,
    name: user.name,
    lastName: user.lastName,
    createdInfo: {
      date: dateFunc(),
      time: timeFunc()
    }
  };

  let deviceLog = await DeviceLog.findOne({
    deviceID: device._doc._id,
    createdInfo: dateFunc()
  });

  if (!deviceLog) {
    deviceLog = createDeviceLog(device._doc, dateFunc());
    await deviceLog.save();
  }

  deviceLog.deleteInfo = deleteInfo;
  await deviceLog.save();
};

exports.deleteDevice = catchAsync(async (req, res, next) => {
  const device = await Device.findById(req.params.id);
  const copyDevice = { ...device };
  if (device.isActive) {
    return next(new AppError('Device is active !', 402));
  }
  if (!device) {
    return next(new AppError('No device found with that ID', 404));
  }
  const firmID = device.firmID;
  const firm = await Firm.findById(firmID);

  if (!firm) {
    return next(new AppError('No firm found with that firmID', 404));
  }

  if (firm.bayserNo === '1') {
    try {
      await Device.findByIdAndDelete(req.params.id);

      await deleteLog(copyDevice, req);

      res.status(200).json({
        status: 'success'
      });
    } catch (err) {
      return next(new AppError(err.message, 500));
    }
  } else {
    return next(new AppError('No firm found with that bayserNo', 404));
  }
});
