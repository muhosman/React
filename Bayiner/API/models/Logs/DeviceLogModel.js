const mongoose = require('mongoose');

const deviceLogSchema = new mongoose.Schema(
  {
    deviceID: {
      type: String,
      required: [true, 'Device has a typeID'],
      trim: true,
      unique: true
    },
    name: {
      type: String,
      required: [true, 'Device has a typeID'],
      trim: true
    },
    statusName: {
      type: String,
      required: [true, 'A device must have a statu ID'],
      trim: true
    },
    firmID: {
      type: String,
      trim: true,
      required: [true, 'A device must have a firmId']
    },
    firmName: {
      type: String,
      trim: true,
      required: [true, 'A device must have a firmName']
    },
    ip: {
      type: String,
      trim: true,
      required: [true, 'A device must have a ip'],
      unique: true
    },
    imei: {
      type: String,
      trim: true,
      required: [true, 'A device must have a imei'],
      unique: true
    },
    gsmNo: {
      type: String,
      trim: true,
      required: [true, 'A device must have a gsmNo'],
      unique: true
    },
    serialNo: {
      type: String,
      trim: true,
      required: [true, 'A device must have a serialNo'],
      unique: true
    },
    userPassword: {
      type: String,
      trim: true,
      required: [true, 'A device must have a userPassword']
    },
    adminPassword: {
      type: String,
      trim: true,
      required: [true, 'A device must have a adminPassword']
    },
    settings: [
      {
        cupNumber: {
          type: Number,
          required: true,
          trim: true,
          max: 4,
          min: 0
        },
        name: {
          type: String,
          trim: true,
          required: true
        },
        cupSettingRow: {
          type: [
            {
              type: String,
              required: true,
              trim: true,
              maxlength: 40,
              strict: true
            }
          ],
          required: [true, 'A device setting must have cup settingsRow']
        },
        generalSettingRow: {
          type: [
            {
              type: String,
              required: true,
              trim: true,
              maxlength: 40,
              strict: true
            }
          ],
          required: [true, 'A device setting must have general settingsRow']
        },
        value: [{ type: String, required: true, trim: true }]
      }
    ],
    productInfo: [
      {
        productName: { type: String, required: true, maxlength: 40 },
        quota: { type: Number, required: true },
        counter: { type: Number, required: true },
        quotaWarning: { type: Number, required: true },
        quotaMax: { type: Number, required: true },
        syncLevel: { type: Number, required: true }
      }
    ],
    isActive: {
      type: Boolean,
      default: true
    },
    note: {
      type: String,
      default: '',
      trim: true
    },
    lastConnectionDate: {
      type: String,
      validator: {
        lastConnectionDate: { $regex: /^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/ }
      },
      required: [true, 'A device must have a last connection date']
    },
    consument: [
      {
        productInfo: [
          {
            typeName: {
              type: String,
              trim: true,
              required: [
                true,
                'A div_reinv must have a created productInfo typeName'
              ]
            },
            quota: {
              type: Number,
              trim: true,
              required: [
                true,
                'A div_reinv must have a created productInfo quota'
              ]
            }
          }
        ],
        firmID: {
          type: String,
          required: [true, 'A div_reinv must have a firmName']
        },
        firmName: {
          type: String,
          required: [true, 'A div_reinv must have a firmName']
        },
        createdInfo: {
          date: {
            type: String,
            trim: true,
            required: [true, 'A div_reinv must have a created date'],
            validator: {
              date: { $regex: /^\d{2}\.\d{2}\.\d{4}$/ }
            }
          },
          time: {
            type: String,
            trim: true,
            validator: {
              time: { $regex: /^\d{2}:\d{2}$/ }
            },
            required: [true, 'A div_reinv must have a created time']
          }
        }
      }
    ],
    fault: [
      {
        userID: {
          type: String,
          required: [true, 'A div_reinv must have a fault name']
        },
        name: {
          type: String,
          required: [true, 'A div_reinv must have a fault name']
        },
        lastName: {
          type: String,
          required: [true, 'A div_reinv must have a fault code']
        },
        faultName: {
          type: String,
          required: [true, 'A div_reinv must have a fault name']
        },
        faultCode: {
          type: String,
          required: [true, 'A div_reinv must have a fault code']
        },
        firmID: {
          type: String,
          required: [true, 'A div_reinv must have a firmName']
        },
        firmName: {
          type: String,
          required: [true, 'A div_reinv must have a firmName']
        },
        createdInfo: {
          date: {
            type: String,
            trim: true,
            required: [true, 'A div_reinv must have a created date'],
            validator: {
              date: { $regex: /^\d{2}\.\d{2}\.\d{4}$/ }
            }
          },
          time: {
            type: String,
            trim: true,
            validator: {
              time: { $regex: /^\d{2}:\d{2}$/ }
            },
            required: [true, 'A div_reinv must have a created time']
          }
        }
      }
    ],
    error: [
      {
        userID: {
          type: String,
          required: [true, 'A div_reinv must have a fault name']
        },
        name: {
          type: String,
          required: [true, 'A div_reinv must have a fault name']
        },
        lastName: {
          type: String,
          required: [true, 'A div_reinv must have a fault code']
        },
        errorName: {
          type: String,
          required: [true, 'A div_reinv must have a fault name']
        },
        errorCode: {
          type: String,
          required: [true, 'A div_reinv must have a fault code']
        },
        firmID: {
          type: String,
          required: [true, 'A div_reinv must have a firmName']
        },
        firmName: {
          type: String,
          required: [true, 'A div_reinv must have a firmName']
        },
        createdInfo: {
          date: {
            type: String,
            trim: true,
            required: [true, 'A div_reinv must have a created date'],
            validator: {
              date: { $regex: /^\d{2}\.\d{2}\.\d{4}$/ }
            }
          },
          time: {
            type: String,
            trim: true,
            validator: {
              time: { $regex: /^\d{2}:\d{2}$/ }
            },
            required: [true, 'A div_reinv must have a created time']
          }
        }
      }
    ],
    manualQuotaUpdate: [
      {
        userID: {
          type: String,
          required: [true, 'A div_reinv must have a fault name']
        },
        name: {
          type: String,
          required: [true, 'A div_reinv must have a fault name']
        },
        lastName: {
          type: String,
          required: [true, 'A div_reinv must have a fault code']
        },
        productInfo: {
          typeName: {
            type: String,
            trim: true,
            required: [
              true,
              'A div_reinv must have a created productInfo typeName'
            ]
          },
          quota: {
            type: Number,
            trim: true,
            required: [
              true,
              'A div_reinv must have a created productInfo quota'
            ]
          },
          alreadyQuota: {
            type: Number,
            trim: true,
            required: [
              true,
              'A div_reinv must have a created productInfo alreadyQuota'
            ]
          },
          counter: {
            type: Number,
            trim: true,
            required: [
              true,
              'A div_reinv must have a created productInfo quota'
            ]
          }
        },
        firmID: {
          type: String,
          required: [true, 'A div_reinv must have a firmName']
        },
        firmName: {
          type: String,
          required: [true, 'A div_reinv must have a firmName']
        },
        createdInfo: {
          date: {
            type: String,
            trim: true,
            required: [true, 'A div_reinv must have a created date'],
            validator: {
              date: { $regex: /^\d{2}\.\d{2}\.\d{4}$/ }
            }
          },
          time: {
            type: String,
            trim: true,
            validator: {
              time: { $regex: /^\d{2}:\d{2}$/ }
            },
            required: [true, 'A div_reinv must have a created time']
          }
        }
      }
    ],
    updateInfo: [
      {
        userID: {
          type: String,
          required: [true, 'A updateInfo must have a userID']
        },
        name: {
          type: String,
          required: [true, 'A updateInfo must have a name']
        },
        lastName: {
          type: String,
          required: [true, 'A updateInfo must have a lastName']
        },
        info: [
          {
            infoName: {
              type: String,
              trim: true,
              required: [true, 'A updateInfo info must have a info']
            },
            valueFrom: {
              type: String,
              trim: true,
              required: [true, 'A updateInfo info must have a valueFrom']
            },
            valueTo: {
              type: String,
              trim: true,
              required: [true, 'A updateInfo info must have a valueTo']
            }
          }
        ],
        createdInfo: {
          date: {
            type: String,
            trim: true,
            required: [true, 'A updateInfo info must have a createdInfo'],
            validator: {
              date: { $regex: /^\d{2}\.\d{2}\.\d{4}$/ }
            }
          },
          time: {
            type: String,
            trim: true,
            validator: {
              time: { $regex: /^\d{2}:\d{2}$/ }
            },
            required: [true, 'A updateInfo info must have a time']
          }
        }
      }
    ],
    updateSettings: [
      {
        userID: {
          type: String,
          required: [true, 'A updateSettings must have a userID']
        },
        name: {
          type: String,
          required: [true, 'A updateSettings must have a name']
        },
        lastName: {
          type: String,
          required: [true, 'A updateSettings must have a lastName']
        },
        setting: [
          {
            infoName: {
              type: String,
              trim: true,
              required: [true, 'A updateSettings setting must have a infoName']
            },
            valueFrom: {
              type: String,
              trim: true,
              required: [true, 'A updateSettings setting must have a valueFrom']
            },
            valueTo: {
              type: String,
              trim: true,
              required: [true, 'A updateSettings setting must have a valueTo']
            }
          }
        ],
        createdInfo: {
          date: {
            type: String,
            trim: true,
            required: [true, 'A updateSettings must have a createdInfo'],
            validator: {
              date: { $regex: /^\d{2}\.\d{2}\.\d{4}$/ }
            }
          },
          time: {
            type: String,
            trim: true,
            validator: {
              time: { $regex: /^\d{2}:\d{2}$/ }
            },
            required: [true, 'A updateSettings must have a created time']
          }
        }
      }
    ],
    deleteInfo: {
      type: Object,
      validate: {
        validator: function(value) {
          if (value == null) {
            return true; // eğer deleteInfo girilmediyse doğrula
          }
          return (
            value.userID != null &&
            value.name != null &&
            value.lastName != null &&
            value.createdInfo != null
          ); // eğer deleteInfo girildiyse, içerisinde userID, name, lastName ve createdInfo değişkenlerinin hepsi varsa doğrula
        },
        message:
          'If deleteInfo is provided, it must include userID, name, lastName, and createdInfo.'
      },
      userID: {
        type: String,
        required: false
      },
      name: {
        type: String,
        required: false
      },
      lastName: {
        type: String,
        required: false
      },
      createdInfo: {
        type: Object,
        required: false,
        validate: {
          validator: function(value) {
            if (value == null) {
              return true;
            }
            return value.date != null && value.time != null;
          },
          message: 'If createdInfo is provided, it must include date and time.'
        },
        date: {
          type: String,
          trim: true,
          required: false,
          validate: {
            validator: function(value) {
              if (value == null) {
                return true; // eğer date girilmediyse doğrula
              }
              return /^\d{2}\.\d{2}\.\d{4}$/.test(value);
            },
            message: 'Invalid date format.'
          }
        },
        time: {
          type: String,
          trim: true,
          required: false,
          validate: {
            validator: function(value) {
              if (value == null) {
                return true; // eğer time girilmediyse doğrula
              }
              return /^\d{2}:\d{2}$/.test(value);
            },
            message: 'Invalid time format.'
          }
        }
      }
    },

    createdInfo: {
      type: String,
      trim: true,
      required: [true, 'A device log must have a created date'],
      validator: {
        date: { $regex: /^\d{2}\.\d{2}\.\d{4}$/ }
      }
    }
  },
  {
    strict: true
  }
);

const DeviceLog = mongoose.model('DeviceLog', deviceLogSchema);

module.exports = DeviceLog;
