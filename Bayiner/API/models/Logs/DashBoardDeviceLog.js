const mongoose = require('mongoose');

const DashBoardDeviceLogSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      trim: true,
      required: [true, 'A device dashboard log must have a productName']
    },
    dailyInfo: {
      type: {
        date: {
          type: String,
          validate: {
            validator: function(v) {
              return /^[0-3]?\d{1}$/.test(v);
            },
            message: 'Invalid day format, must be in dd format'
          },
          required: [true, 'A device dashboard log must have a day']
        },
        consumption: {
          type: Number,
          required: [
            true,
            'A device dashboard log must have a consumption value'
          ]
        }
      }
    },
    lastDayInfo: {
      type: {
        date: {
          type: String,
          validate: {
            validator: function(v) {
              return /^[0-3]?\d{1}$/.test(v);
            },
            message: 'Invalid day format, must be in dd format'
          },
          required: [true, 'A device dashboard log must have a day']
        },
        consumption: {
          type: Number,
          required: [
            true,
            'A device dashboard log must have a consumption value'
          ]
        }
      }
    },
    lastWeekInfo: {
      type: [
        {
          date: {
            type: String,
            validate: {
              validator: function(v) {
                return /^[0-3]?\d{1}$/.test(v);
              },
              message: 'Invalid day format, must be in dd format'
            },
            required: [true, 'A weekly consumption log must have a date value']
          },
          consumption: {
            type: Number,
            required: [
              true,
              'A weekly consumption log must have a consumption value'
            ]
          }
        }
      ],
      default: []
    },
    lastMonthInfo: {
      type: {
        date: {
          type: String,
          validate: {
            validator: function(v) {
              return /^[01]?\d{1}$/.test(v);
            },
            message: 'Invalid month format, must be in mm format'
          },
          required: [true, 'A device dashboard log must have a month']
        },
        consumption: {
          type: Number,
          required: [
            true,
            'A device dashboard log must have a consumption value'
          ]
        }
      }
    },
    lastYearInfo: {
      type: {
        date: {
          type: String,
          validate: {
            validator: function(v) {
              return /^\d{4}$/.test(v);
            },
            message: 'Invalid year format, must be in yyyy format'
          },
          required: [true, 'A device dashboard log must have a year']
        },
        consumption: {
          type: Number,
          required: [
            true,
            'A device dashboard log must have a consumption value'
          ]
        }
      }
    },
    lastSixMonthConsumption: {
      type: [
        {
          monthName: {
            type: String,
            required: [true, 'A monthly consumption log must have a month name']
          },
          consumption: {
            type: Number,
            required: [
              true,
              'A monthly consumption log must have a consumption value'
            ]
          }
        }
      ],
      default: []
    }
  },
  {
    strict: true
  }
);

const DashBoardDeviceLog = mongoose.model(
  'DashBoardDeviceLog',
  DashBoardDeviceLogSchema
);

module.exports = DashBoardDeviceLog;
