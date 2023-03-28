const mongoose = require('mongoose');

const DashBoardFirmLogSchema = new mongoose.Schema(
  {
    main: {
      type: String,
      default: 'MainDashBoard',
      required: true
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
        FirstFiveFirms: [
          {
            id: {
              type: String,
              required: [true, 'Firm must have id']
            },
            name: {
              type: String,
              required: [true, 'Firm must have name']
            },
            counter: {
              type: Number,
              required: [true, 'Firm must have counter']
            }
          }
        ],
        includedFirm: [
          {
            id: {
              type: String,
              required: [true, 'Firm must have id']
            },
            name: {
              type: String,
              required: [true, 'Firm must have name']
            }
          }
        ],
        excludedFirm: [
          {
            id: {
              type: String,
              required: [true, 'Firm must have id']
            },
            name: {
              type: String,
              required: [true, 'Firm must have name']
            }
          }
        ],
        includedDevice: [
          {
            id: {
              type: String,
              required: [true, 'Firm must have id']
            },
            name: {
              type: String,
              required: [true, 'Firm must have name']
            }
          }
        ]
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
        FirstFiveFirms: [
          {
            id: {
              type: String,
              required: [true, 'Firm must have id']
            },
            name: {
              type: String,
              required: [true, 'Firm must have name']
            },
            counter: {
              type: Number,
              required: [true, 'Firm must have counter']
            }
          }
        ],
        includedFirm: [
          {
            id: {
              type: String,
              required: [true, 'Firm must have id']
            },
            name: {
              type: String,
              required: [true, 'Firm must have name']
            }
          }
        ],
        excludedFirm: [
          {
            id: {
              type: String,
              required: [true, 'Firm must have id']
            },
            name: {
              type: String,
              required: [true, 'Firm must have name']
            }
          }
        ],
        includedDevice: [
          {
            id: {
              type: String,
              required: [true, 'Firm must have id']
            },
            name: {
              type: String,
              required: [true, 'Firm must have name']
            }
          }
        ]
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
          FirstFiveFirms: [
            {
              id: {
                type: String,
                required: [true, 'Firm must have id']
              },
              name: {
                type: String,
                required: [true, 'Firm must have name']
              },
              counter: {
                type: Number,
                required: [true, 'Firm must have counter']
              }
            }
          ],
          includedFirm: [
            {
              id: {
                type: String,
                required: [true, 'Firm must have id']
              },
              name: {
                type: String,
                required: [true, 'Firm must have name']
              }
            }
          ],
          excludedFirm: [
            {
              id: {
                type: String,
                required: [true, 'Firm must have id']
              },
              name: {
                type: String,
                required: [true, 'Firm must have name']
              }
            }
          ],
          includedDevice: [
            {
              id: {
                type: String,
                required: [true, 'Firm must have id']
              },
              name: {
                type: String,
                required: [true, 'Firm must have name']
              }
            }
          ]
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
        FirstFiveFirms: [
          {
            id: {
              type: String,
              required: [true, 'Firm must have id']
            },
            name: {
              type: String,
              required: [true, 'Firm must have name']
            },
            counter: {
              type: Number,
              required: [true, 'Firm must have counter']
            }
          }
        ],
        includedFirm: [
          {
            id: {
              type: String,
              required: [true, 'Firm must have id']
            },
            name: {
              type: String,
              required: [true, 'Firm must have name']
            }
          }
        ],
        excludedFirm: [
          {
            id: {
              type: String,
              required: [true, 'Firm must have id']
            },
            name: {
              type: String,
              required: [true, 'Firm must have name']
            }
          }
        ],
        includedDevice: [
          {
            id: {
              type: String,
              required: [true, 'Firm must have id']
            },
            name: {
              type: String,
              required: [true, 'Firm must have name']
            }
          }
        ]
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
        FirstFiveFirms: [
          {
            id: {
              type: String,
              required: [true, 'Firm must have id']
            },
            name: {
              type: String,
              required: [true, 'Firm must have name']
            },
            counter: {
              type: Number,
              required: [true, 'Firm must have counter']
            }
          }
        ],
        includedFirm: [
          {
            id: {
              type: String,
              required: [true, 'Firm must have id']
            },
            name: {
              type: String,
              required: [true, 'Firm must have name']
            }
          }
        ],
        excludedFirm: [
          {
            id: {
              type: String,
              required: [true, 'Firm must have id']
            },
            name: {
              type: String,
              required: [true, 'Firm must have name']
            }
          }
        ],
        includedDevice: [
          {
            id: {
              type: String,
              required: [true, 'Firm must have id']
            },
            name: {
              type: String,
              required: [true, 'Firm must have name']
            }
          }
        ]
      }
    },
    lastSixMonth: {
      type: [
        {
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
          FirstFiveFirms: [
            {
              id: {
                type: String,
                required: [true, 'Firm must have id']
              },
              name: {
                type: String,
                required: [true, 'Firm must have name']
              },
              counter: {
                type: Number,
                required: [true, 'Firm must have counter']
              }
            }
          ],
          includedFirm: [
            {
              id: {
                type: String,
                required: [true, 'Firm must have id']
              },
              name: {
                type: String,
                required: [true, 'Firm must have name']
              }
            }
          ],
          excludedFirm: [
            {
              id: {
                type: String,
                required: [true, 'Firm must have id']
              },
              name: {
                type: String,
                required: [true, 'Firm must have name']
              }
            }
          ],
          includedDevice: [
            {
              id: {
                type: String,
                required: [true, 'Firm must have id']
              },
              name: {
                type: String,
                required: [true, 'Firm must have name']
              }
            }
          ]
        }
      ],
      default: []
    }
  },
  {
    strict: true
  }
);

const DashBoardFirmLog = mongoose.model(
  'DashBoardFirmLog',
  DashBoardFirmLogSchema
);

module.exports = DashBoardFirmLog;
