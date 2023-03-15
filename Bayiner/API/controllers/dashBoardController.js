const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const DashBoardDeviceLog = require('./../models/Logs/DashBoardDeviceLog');
const Device = require('./../models/Device/deviceModel');

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
        consumption: 0
      };
      deviceLog.dailyInfo = dailyLog;

      if (deviceLog.lastYearInfo.date !== currentYear) {
        deviceLog.lastYearInfo.date = currentYear;
        deviceLog.lastYearInfo.consumption = 0;
      }

      // If not, use the daily log as the last day log and create a new daily log

      deviceLog.lastWeekInfo.push({
        date: dailyLog.date,
        consumption: 0
      });

      if (deviceLog.lastWeekInfo.length > MAX_WEEKLY_LOGS) {
        deviceLog.lastWeekInfo.shift();
      }

      if (deviceLog.lastMonthInfo.date !== month) {
        deviceLog.lastMonthInfo = {
          date: month,
          consumption: 0
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
          consumption: 0
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
