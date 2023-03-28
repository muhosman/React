const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Bill = require('./../models/BillModel');
const ProductInfo = require('./../models/Product/productInfoModel');
const Firm = require('../models/firmModel');
const Stock = require('./../models/stockModel');
const Device = require('./../models/Device/deviceModel');
const FirmLog = require('./../models/Logs/FirmLogModel');
const User = require('./../models/userModel');
const DashBoardDeviceLog = require('./../models/Logs/DashBoardDeviceLog');
const DashBoardFirmLog = require('./../models/Logs/DashBoardFirmLog');

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

async function updateDashboardFirstFiveFirms(FirstFiveFirms) {
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
      FirstFiveFirms: [],
      includedFirm: [],
      excludedFirm: [],
      includedDevice: []
    };
    dailyLog.FirstFiveFirms = FirstFiveFirms;
  } else if (dailyLog.date !== currentDay) {
    // If not, use the daily log as the last day log and create a new daily log
    dashboardFirmLog.lastDayInfo = dailyLog;
    dailyLog = {
      date: currentDay,
      FirstFiveFirms: [],
      includedFirm: [],
      excludedFirm: [],
      includedDevice: []
    };
    dailyLog.FirstFiveFirms = FirstFiveFirms;
  } else {
    // Update the daily consumption value
    dailyLog.FirstFiveFirms = FirstFiveFirms;
  }

  // Update the device log with the new values
  dashboardFirmLog.dailyInfo = dailyLog;

  if (dashboardFirmLog.lastWeekInfo.length === 0) {
    dashboardFirmLog.lastWeekInfo.push({
      date: dailyLog.date,
      FirstFiveFirms: dailyLog.FirstFiveFirms,
      includedFirm: [],
      excludedFirm: [],
      includedDevice: []
    });
  } else {
    const dailyLogDate = dailyLog.date;
    const matchingDayIndex = dashboardFirmLog.lastWeekInfo.findIndex(
      weekLog => weekLog.date === dailyLogDate
    );

    if (matchingDayIndex >= 0) {
      dashboardFirmLog.lastWeekInfo[
        matchingDayIndex
      ].FirstFiveFirms = FirstFiveFirms;
    } else {
      dashboardFirmLog.lastWeekInfo.push({
        date: dailyLogDate,
        FirstFiveFirms: dailyLog.FirstFiveFirms,
        includedFirm: [],
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
      FirstFiveFirms: dailyLog.FirstFiveFirms,
      includedFirm: [],
      excludedFirm: [],
      includedDevice: []
    };
  } else if (dashboardFirmLog.lastMonthInfo.date === month) {
    dashboardFirmLog.lastMonthInfo.FirstFiveFirms = FirstFiveFirms;
  } else {
    dashboardFirmLog.lastMonthInfo = {
      date: month,
      FirstFiveFirms: dailyLog.FirstFiveFirms,
      includedFirm: [],
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
    dashboardFirmLog.lastSixMonth[
      monthlyLogIndex
    ].FirstFiveFirms = FirstFiveFirms;
  } else {
    // If not, create a new monthly consumption log for the current month
    dashboardFirmLog.lastSixMonth.push({
      date: month,
      FirstFiveFirms: dailyLog.FirstFiveFirms,
      includedFirm: [],
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
      FirstFiveFirms: dailyLog.FirstFiveFirms,
      includedFirm: [],
      excludedFirm: [],
      includedDevice: []
    };
  } else if (dashboardFirmLog.lastYearInfo.date !== currentYear) {
    dashboardFirmLog.lastYearInfo.date = currentYear;
    dashboardFirmLog.lastYearInfo.FirstFiveFirms = FirstFiveFirms;
  } else {
    // Update the last year consumption value
    dashboardFirmLog.lastYearInfo.FirstFiveFirms = FirstFiveFirms;
  }

  // Save the updated device log to the database
  await dashboardFirmLog.save();
}

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

async function updateDashboard({ price, productName }) {
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
      consumption: 0,
      price: price
    };
  } else if (dailyLog.date !== currentDay) {
    // If not, use the daily log as the last day log and create a new daily log
    deviceLog.lastDayInfo = dailyLog;
    dailyLog = {
      date: currentDay,
      consumption: 0,
      price: price
    };
  } else {
    // Update the daily consumption value
    dailyLog.price += price;
  }

  // Update the device log with the new values
  deviceLog.dailyInfo = dailyLog;
  if (deviceLog.lastWeekInfo.length === 0) {
    deviceLog.lastWeekInfo.push({
      date: dailyLog.date,
      consumption: dailyLog.consumption,
      price: dailyLog.price
    });
  } else {
    const dailyLogDate = dailyLog.date;
    const matchingDayIndex = deviceLog.lastWeekInfo.findIndex(
      weekLog => weekLog.date === dailyLogDate
    );

    if (matchingDayIndex >= 0) {
      deviceLog.lastWeekInfo[matchingDayIndex].price += price;
    } else {
      deviceLog.lastWeekInfo.push({
        date: dailyLog.date,
        consumption: dailyLog.consumption,
        price: dailyLog.price
      });
      if (deviceLog.lastWeekInfo.length > MAX_WEEKLY_LOGS) {
        deviceLog.lastWeekInfo.shift();
      }
    }
  }

  if (!deviceLog.lastMonthInfo) {
    deviceLog.lastMonthInfo = {
      date: month,
      consumption: 0,
      price: price
    };
  } else if (deviceLog.lastMonthInfo.date === month) {
    deviceLog.lastMonthInfo.price += price;
  } else {
    deviceLog.lastMonthInfo = {
      date: month,
      consumption: 0,
      price: price
    };
  }
  // Find the monthly consumption log for the current month
  const monthlyLogIndex = deviceLog.lastSixMonthConsumption.findIndex(
    log => log.monthName === month
  );

  // If there is an existing monthly consumption log for the current month, update its consumption value
  if (monthlyLogIndex >= 0) {
    deviceLog.lastSixMonthConsumption[monthlyLogIndex].price += price;
  } else {
    // If not, create a new monthly consumption log for the current month
    deviceLog.lastSixMonthConsumption.push({
      monthName: month,
      consumption: 0,
      price: price
    });

    // If there are more than MAX_MONTHLY_LOGS logs, remove the oldest log
    if (deviceLog.lastSixMonthConsumption.length > MAX_MONTHLY_LOGS) {
      deviceLog.lastSixMonthConsumption.shift();
    }
  }

  if (!deviceLog.lastYearInfo) {
    deviceLog.lastYearInfo = {
      date: currentYear,
      consumption: 0,
      price: price
    };
  } else if (deviceLog.lastYearInfo.date !== currentYear) {
    deviceLog.lastYearInfo.date = currentYear;
    deviceLog.lastYearInfo.consumption = 0;
    deviceLog.lastYearInfo.price = price;
  } else {
    // Update the last year consumption value
    deviceLog.lastYearInfo.price += price;
  }

  // Save the updated device log to the database
  await deviceLog.save();
}

exports.getAllBills = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Bill.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const bills = await features.query;

  res.status(200).json({
    status: 'success',
    results: bills.length,
    data: {
      bills
    }
  });
});

exports.getBill = catchAsync(async (req, res, next) => {
  const firm = await Firm.findById(req.params.id);
  const bills = await Bill.find({ bayserNo: firm.bayserNo });

  if (!bills) {
    return next(new AppError('No bill found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    results: bills.length,
    data: {
      bills
    }
  });
});

exports.createBill = catchAsync(async (req, res, next) => {
  const { bills } = req.body;
  const quotasToAdd = [];
  const quotasToAddStock = [];
  const successfulBills = [];
  const user = await currentUser(req);
  const now = new Date();

  await Promise.all(
    bills.map(async billData => {
      const {
        billNo,
        firmApellation,
        bayserNo,
        shippingInfo,
        productCode,
        quota,
        income,
        price
      } = billData;
      const billObj = { ...billData };

      // Check if a bill with the same billNo already exists
      const existingBill = await Bill.findOne({ billNo, productCode });

      if (existingBill) {
        return;
      }
      // Retrieve the productInfo object associated with the productCode provided
      const productInfo = await ProductInfo.findOne({ code: productCode });

      if (productInfo) {
        // Check that the firm associated with the bayserNo provided exists
        const firm = await Firm.findOne({ bayserNo });

        if (firm) {
          // Add the typeName and quota objects to the quotasToAdd array
          const { typeName } = productInfo;
          const quotaObj = { typeName, quota, bayserNo, income };
          const quotaObjStock = { productCode, quota };

          const product = firm.productInfo.find(
            p => p.productName === typeName
          );

          if (product) {
            const existingQuota = quotasToAdd.find(
              q => q.typeName === typeName && q.bayserNo === bayserNo
            );

            if (existingQuota) {
              existingQuota.income += income;
              existingQuota.quota += quota;
            } else {
              quotasToAdd.push(quotaObj);
            }

            const existingQuotaStock = quotasToAddStock.find(
              q => q.productCode === productCode
            );

            if (existingQuotaStock) {
              existingQuotaStock.quota += quota;
            } else {
              quotasToAddStock.push(quotaObjStock);
            }

            const bill = new Bill({
              billNo,
              firmApellation,
              bayserNo,
              typeName,
              shippingInfo,
              productCode,
              productName: productInfo.name,
              quota,
              income,
              price,
              createdInfo: dateAndHour(),
              updatedInfo: dateAndHour()
            });

            await bill.save();

            // Update the FirmLog with the new bill
            const firmLog = await createOrUpdateFirmLog(firm, [], req);
            const date = `${now.getDate()}.${now.getMonth() +
              1}.${now.getFullYear()}`;
            const time = `${now.getHours()}:${now.getMinutes()}`;

            firmLog.updateBill.push({
              userID: user._id,
              name: user.name,
              lastName: user.lastName,
              operation: 'Added',
              info: {
                billNo: bill.billNo,
                productCode: bill.productCode,
                productName: bill.productName,
                quota: bill.quota,
                income: bill.income,
                price: bill.price
              },
              createdInfo: {
                date,
                time
              }
            });

            await firmLog.save();

            billObj.failureMessage = 'Fatura başarıyla yüklendi !';
            successfulBills.push(billObj);
          }
        }
      }
    })
  );

  // eslint-disable-next-line no-shadow
  quotasToAddStock.map(async quotaObj => {
    // eslint-disable-next-line no-shadow
    const { productCode, quota } = quotaObj;

    // Find the stock entry for the given productCode
    const stockEntry = await Stock.findOne({ productCode });

    if (stockEntry) {
      // If a stock entry is found, update its quota
      stockEntry.deleteProductQuota(quota);
    }
  });

  // eslint-disable-next-line no-shadow
  quotasToAdd.map(async quotaObj => {
    // eslint-disable-next-line no-shadow
    const { typeName, quota, bayserNo, income } = quotaObj;
    // eslint-disable-next-line no-shadow
    const firm = await Firm.findOne({ bayserNo });
    firm.addProductQuota(typeName, quota);
    await updateDashboard({
      price: income,
      productName: typeName
    });
  });

  if (successfulBills.length === 0) {
    return next(new AppError('We didnt upload any bill', 404));
  }

  const topFirms = await FirmLog.aggregate([
    { $unwind: '$updateBill' },
    { $match: { 'updateBill.operation': 'Added' } },
    {
      $group: {
        _id: '$firmID',
        id: { $first: '$firmID' }, // bu şekilde id alanı oluşturabilirsiniz
        name: { $first: '$name' },
        counter: { $sum: '$updateBill.info.income' }
      }
    },
    { $sort: { counter: -1 } },
    { $limit: 5 }
  ]);

  await updateDashboardFirstFiveFirms(topFirms);

  res.status(201).json({
    status: 'success',
    bills: successfulBills,
    results: successfulBills.length
  });
});

exports.controlBill = catchAsync(async (req, res, next) => {
  const { bills } = req.body;

  const result = bills.map(async billData => {
    const { billNo, bayserNo, productCode, productName } = billData;

    const billObj = { ...billData }; // create a copy of the bill object

    // Check if a bill with the same billNo already exists
    const existingBill = await Bill.findOne({ billNo });
    if (existingBill) {
      billObj.failureMessage = `Hali hazırda bu fatura numarası ile bir fatura zaten mevuct !`;
      return billObj;
    }

    // Retrieve the productInfo object associated with the productCode provided
    const productInfo = await ProductInfo.findOne({
      code: productCode,
      name: productName
    });
    if (!productInfo) {
      billObj.failureMessage = `Kestiğiniz faturada ki ürün kodu, sistem tanımlı değil !`;
      return billObj;
    }

    // Check that the firm associated with the bayserNo provided exists
    const firm = await Firm.findOne({ bayserNo });

    if (!firm) {
      billObj.failureMessage = `Faturayı kestiğiniz firmanın bayser numarası sistemde mevcut değil !`;
      return billObj;
    }

    const product = firm.productInfo.find(
      p => p.productName === productInfo.typeName
    );

    if (!product) {
      billObj.failureMessage = `Bu firma bu ürüne sahip değil !`;
      return billObj;
    }

    billObj.failureMessage = 'Fatura yüklenmeye hazır !';

    return billObj;
  });

  const results = await Promise.all(result); // wait for all promises to resolve

  res.status(201).json({
    status: 'success',
    results: bills.length,
    bills: results
  });
});

exports.deleteBill = catchAsync(async (req, res, next) => {
  const bill = await Bill.findById(req.params.id);
  const user = await currentUser(req);
  if (!bill) {
    return next(new AppError('No bill found with that ID', 404));
  }

  const { bayserNo, productCode, quota } = bill;

  // Retrieve the productInfo object associated with the productCode provided
  const productInfo = await ProductInfo.findOne({ code: productCode });

  if (!productInfo) {
    return next(
      new AppError('No product info found with that product code', 404)
    );
  }

  // Check that the firm associated with the bayserNo provided exists
  const firm = await Firm.findOne({ bayserNo });

  if (!firm) {
    return next(new AppError('No firm found with that bayserNo', 404));
  }

  // Toplam kotayı hesaplayın
  let totalQuota = 0;
  let numDevices = 0;

  const firmProductInfo = firm.productInfo;
  let indexFirm = -1;
  for (let i = 0; i < firmProductInfo.length; i += 1) {
    // eslint-disable-next-line no-plusplus
    if (firmProductInfo[i].productName === productInfo.typeName) {
      totalQuota += firmProductInfo[i].quota;
      indexFirm = i;
      break;
    }
  }

  if (indexFirm === -1) {
    return next(new AppError('No firm found with that product name', 404));
  }

  if (!(totalQuota >= bill.quota)) {
    // Tüm cihazlardaki ürün bilgisi dizilerini alın
    const productInfoArrays = await Device.find({
      firmID: firm._id,
      statusName: 'Firma',
      isActive: true
    }).distinct('productInfo');

    if (!productInfoArrays) {
      return next(new AppError('No device found with that product name', 404));
    }

    for (let i = 0; i < productInfoArrays.length; i += 1) {
      if (productInfo.typeName === productInfoArrays[i].productName) {
        totalQuota += productInfoArrays[i].quota;
        numDevices += 1;
      }
    }

    if (!(totalQuota > bill.quota)) {
      return next(new AppError('Total quota is not needed', 404));
    }

    totalQuota -= bill.quota;
    // Her cihaz için eşit dağıtılacak kotayı hesaplayın
    const perDeviceQuota = Math.ceil(totalQuota / numDevices);

    if (perDeviceQuota < 30) {
      return next(
        new AppError('The total quota that you want to divide is very low', 404)
      );
    }

    // Tüm cihazların ürün bilgisi dizilerini alın
    const devices = await Device.find({
      firmID: firm._id,
      statusName: 'Firma',
      isActive: true
    });

    // Tüm cihazların ürün bilgisi dizilerindeki productName'e sahip olanların kotayı eşit dağıtın
    devices.forEach(device => {
      const deviceProductInfo = device.productInfo.find(
        product => product.productName === productInfo.typeName
      );

      if (deviceProductInfo) {
        if (totalQuota <= perDeviceQuota) {
          // son cihazın kotayı toplam kota ile doldur
          deviceProductInfo.quota = totalQuota;
          totalQuota = 0;
        } else {
          // diğer cihazlara perDeviceQuota kadar kota ver
          deviceProductInfo.quota = perDeviceQuota;
          totalQuota -= perDeviceQuota;
        }
        device.save();
      }
    });
  } else totalQuota -= bill.quota;

  // Find the stock entry for the given productCode
  const stockEntry = await Stock.findOne({ productCode });
  if (stockEntry) {
    // If a stock entry is found, update its quota
    stockEntry.addProductQuota(quota);
  }

  const productNameToDelete = bill.typeName;
  const productIncomeToDelete = bill.income;
  await bill.delete();

  await updateDashboard({
    price: productIncomeToDelete,
    productName: productNameToDelete
  });

  firm.productInfo[indexFirm].quota = totalQuota;
  await firm.save();

  // Update the FirmLog with the deleted bill
  const firmLog = await createOrUpdateFirmLog(firm, [], req);
  const now = new Date();
  const date = `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`;
  const time = `${now.getHours()}:${now.getMinutes()}`;

  firmLog.updateBill.push({
    userID: user._id,
    name: user.name,
    lastName: user.lastName,
    operation: 'Deleted',
    info: {
      billNo: bill.billNo,
      productCode: bill.productCode,
      productName: bill.productName,
      quota: bill.quota,
      income: bill.income,
      price: bill.price
    },
    createdInfo: {
      date,
      time
    }
  });
  await firmLog.save();

  res.status(204).json({
    status: 'success'
  });
});
