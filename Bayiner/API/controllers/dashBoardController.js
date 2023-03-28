/* eslint-disable prefer-destructuring */
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const DashBoardDeviceLog = require('./../models/Logs/DashBoardDeviceLog');
const Device = require('./../models/Device/deviceModel');
const DashBoardFirmLog = require('./../models/Logs/DashBoardFirmLog');
const Bill = require('./../models/BillModel');

async function updateDashboard() {
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
  const deviceLogs = await DashBoardDeviceLog.find();

  deviceLogs.map(async deviceLog => {
    // Check if there is an existing daily log for the current day
    let dailyLogDate = deviceLog.dailyInfo.date;
    let dailyLogConsumption = deviceLog.dailyInfo.consumption;

    if (dailyLogDate !== currentDay) {
      deviceLog.lastDayInfo = deviceLog.dailyInfo;

      const dailyLog = {
        date: currentDay,
        consumption: 0,
        price: 0
      };
      deviceLog.dailyInfo = dailyLog;

      if (deviceLog.lastYearInfo.date !== currentYear) {
        deviceLog.lastYearInfo.date = currentYear;
        deviceLog.lastYearInfo.consumption = 0;
        deviceLog.lastYearInfo.price = 0;
      }

      // If not, use the daily log as the last day log and create a new daily log

      deviceLog.lastWeekInfo.push({
        date: dailyLog.date,
        consumption: 0,
        price: 0
      });

      if (deviceLog.lastWeekInfo.length > MAX_WEEKLY_LOGS) {
        deviceLog.lastWeekInfo.shift();
      }

      if (deviceLog.lastMonthInfo.date !== month) {
        deviceLog.lastMonthInfo = {
          date: month,
          consumption: 0,
          price: 0
        };
      }

      // Find the monthly consumption log for the current month
      const monthlyLogIndex = deviceLog.lastSixMonthConsumption.findIndex(
        log => log.monthName === month
      );

      // If there is an existing monthly consumption log for the current month, update its consumption value
      if (monthlyLogIndex < 0) {
        // If not, create a new monthly consumption log for the current month
        deviceLog.lastSixMonthConsumption.push({
          monthName: month,
          consumption: 0,
          price: 0
        });
        // If there are more than MAX_MONTHLY_LOGS logs, remove the oldest log
        if (deviceLog.lastSixMonthConsumption.length > MAX_MONTHLY_LOGS) {
          deviceLog.lastSixMonthConsumption.shift();
        }
      }

      // Save the updated device log to the database
      await deviceLog.save();
    }
  });
}

exports.getAllDashBoardDevice = catchAsync(async (req, res, next) => {
  const featuresDashBoardDevice = new APIFeatures(
    DashBoardDeviceLog.find(),
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

  await updateDashboard();

  res.status(200).json({
    status: 'success',
    results: dashBoardDevices.length,
    data: {
      dashBoardDevices,
      devices
    }
  });
});

function getTopFiveFirmsForWeek(weekData) {
  const firmsCount = new Map();

  weekData.forEach(day => {
    day.FirstFiveFirms.forEach(firm => {
      if (firmsCount.has(firm.id)) {
        firmsCount.set(firm.id, firmsCount.get(firm.id) + firm.counter);
      } else {
        firmsCount.set(firm.id, firm.counter);
      }
    });
  });

  const sortedFirms = Array.from(firmsCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topFiveFirms = sortedFirms.map(entry => {
    return {
      id: entry[0],
      name: weekData
        .find(day => day.FirstFiveFirms.find(firm => firm.id === entry[0]))
        .FirstFiveFirms.find(firm => firm.id === entry[0]).name,
      counter: entry[1]
    };
  });

  return topFiveFirms;
}

exports.calculateFirstFiveFirms = catchAsync(async (req, res, next) => {
  const dashboardFirmLog = await DashBoardFirmLog.findOne({
    main: 'MainDashBoard'
  });

  const { day } = req.query;

  let FirstFiveFirms = [];

  if (day === 'dailyInfo') {
    FirstFiveFirms = dashboardFirmLog.dailyInfo.FirstFiveFirms;
  } else if (day === 'lastDayInfo') {
    FirstFiveFirms = dashboardFirmLog.lastDayInfo.FirstFiveFirms;
  } else if (day === 'lastWeekInfo') {
    FirstFiveFirms = getTopFiveFirmsForWeek(dashboardFirmLog.lastWeekInfo);
  } else if (day === 'lastMonthInfo') {
    FirstFiveFirms = dashboardFirmLog.lastMonthInfo.FirstFiveFirms;
  } else if (day === 'lastYearInfo') {
    FirstFiveFirms = dashboardFirmLog.lastYearInfo.FirstFiveFirms;
  }

  res.status(200).json({
    status: 'success',
    data: {
      FirstFiveFirms
    }
  });
});

function getMonthAndYear(dateString) {
  const dateParts = dateString.split(' ')[0].split('.');
  return {
    dayy: dateParts[0],
    month: dateParts[1],
    year: dateParts[2]
  };
}

function getGeneralInfoForWeek(weekData) {
  let includedFirm = [];
  let excludedFirm = [];
  let includedDevice = [];

  weekData.forEach(day => {
    day.includedFirm?.map(incFirm => {
      includedFirm.push(incFirm);
    });
    day.includedFirm?.map(excFirm => {
      excludedFirm.push(excFirm);
    });
    day.includedDevice?.map(incDevice => {
      includedDevice.push(incDevice);
    });
  });
  return [includedFirm, excludedFirm, includedDevice];
}

function getPreviousDayDate() {
  const currentDate = new Date();
  const previousDay = new Date(currentDate.setDate(currentDate.getDate() - 1));
  return {
    day: String(previousDay.getDate()).padStart(2, '0'),
    month: String(previousDay.getMonth() + 1).padStart(2, '0'),
    year: previousDay.getFullYear()
  };
}

function getDateDaysAgo(days) {
  const currentDate = new Date();
  const pastDate = new Date(currentDate.setDate(currentDate.getDate() - days));
  return {
    day: String(pastDate.getDate()).padStart(2, '0'),
    month: String(pastDate.getMonth() + 1).padStart(2, '0'),
    year: pastDate.getFullYear()
  };
}

exports.getGeneralInfo = catchAsync(async (req, res, next) => {
  const currentDate = new Date();
  const currentDay = String(currentDate.getDate()).padStart(2, '0');
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
  const currentYear = currentDate.getFullYear();
  let totalIncome = 0;

  const dashboardFirmLog = await DashBoardFirmLog.findOne({
    main: 'MainDashBoard'
  });

  const { day } = req.query;

  let includedFirm = [];
  let excludedFirm = [];
  let includedDevice = [];
  let bills = await Bill.find();

  if (day === 'dailyInfo') {
    includedFirm = dashboardFirmLog.dailyInfo.includedFirm;
    excludedFirm = dashboardFirmLog.dailyInfo.excludedFirm;
    includedDevice = dashboardFirmLog.dailyInfo.includedDevice;
    bills = bills.filter(bill => {
      const { dayy, month, year } = getMonthAndYear(bill.createdInfo);
      const isIncluded =
        parseInt(dayy, 10) === parseInt(currentDay, 10) &&
        parseInt(month, 10) === parseInt(currentMonth, 10) &&
        parseInt(year, 10) === parseInt(currentYear, 10);

      if (isIncluded) {
        totalIncome += bill.income;
      }
      return isIncluded;
    });
  } else if (day === 'lastDayInfo') {
    const previousDayDate = getPreviousDayDate();
    includedFirm = dashboardFirmLog.lastDayInfo.includedFirm;
    excludedFirm = dashboardFirmLog.lastDayInfo.excludedFirm;
    includedDevice = dashboardFirmLog.lastDayInfo.includedDevice;
    bills = bills.filter(bill => {
      const { dayy, month, year } = getMonthAndYear(bill.createdInfo);
      const isIncluded =
        parseInt(dayy, 10) === parseInt(previousDayDate.day, 10) &&
        parseInt(month, 10) === parseInt(previousDayDate.month, 10) &&
        parseInt(year, 10) === parseInt(previousDayDate.year, 10);
      if (isIncluded) {
        totalIncome += bill.income;
      }
      return isIncluded;
    });
  } else if (day === 'lastWeekInfo') {
    const oneWeekAgoDate = getDateDaysAgo(7);
    [includedFirm, excludedFirm, includedDevice] = getGeneralInfoForWeek(
      dashboardFirmLog.lastWeekInfo
    );
    bills = bills.filter(bill => {
      const { dayy, month, year } = getMonthAndYear(bill.createdInfo);
      const billDate = new Date(year, month - 1, dayy);
      const weekAgoDate = new Date(
        oneWeekAgoDate.year,
        oneWeekAgoDate.month - 1,
        oneWeekAgoDate.day
      );
      const currentDatee = new Date(currentYear, currentMonth - 1, currentDay);

      const isIncluded = billDate > weekAgoDate && billDate <= currentDatee;
      if (isIncluded) {
        totalIncome += bill.income;
      }
      return isIncluded;
    });
  } else if (day === 'lastMonthInfo') {
    includedFirm = dashboardFirmLog.lastMonthInfo.includedFirm;
    excludedFirm = dashboardFirmLog.lastMonthInfo.excludedFirm;
    includedDevice = dashboardFirmLog.lastMonthInfo.includedDevice;
    bills = bills.filter(bill => {
      const { month, year } = getMonthAndYear(bill.createdInfo);
      const isIncluded =
        parseInt(month, 10) === parseInt(currentMonth, 10) &&
        parseInt(year, 10) === parseInt(currentYear, 10);
      if (isIncluded) {
        totalIncome += bill.income;
      }
      return isIncluded;
    });
  } else if (day === 'lastYearInfo') {
    includedFirm = dashboardFirmLog.lastYearInfo.includedFirm;
    excludedFirm = dashboardFirmLog.lastYearInfo.excludedFirm;
    includedDevice = dashboardFirmLog.lastYearInfo.includedDevice;
    bills = bills.filter(bill => {
      const { year } = getMonthAndYear(bill.createdInfo);
      const isIncluded = parseInt(year, 10) === parseInt(currentYear, 10);
      if (isIncluded) {
        totalIncome += bill.income;
      }
      return isIncluded;
    });
  }

  console.log(includedDevice);
  res.status(200).json({
    status: 'success',
    includedFirmResults: includedFirm.length,
    excludedFirmResults: excludedFirm.length,
    includedDeviceResults: includedDevice.length,
    billsResults: totalIncome,

    data: {
      includedFirm,
      excludedFirm,
      includedDevice,
      bills
    }
  });
});
