const mongoose = require('mongoose');

const firmLogSchema = new mongoose.Schema(
  {
    firmID: {
      type: String,
      required: [true, 'Device has a typeID'],
      trim: true
    },
    createdInfo: {
      day: {
        type: Number,
        required: [true, 'A div_reinv must have a day'],
        min: 1,
        max: 31
      },
      month: {
        type: Number,
        required: [true, 'A div_reinv must have a month'],
        min: 1,
        max: 12
      },
      year: {
        type: Number,
        required: [true, 'A div_reinv must have a year'],
        min: 1900,
        max: 3000
      }
    },
    name: {
      type: String,
      maxlength: 40,
      trim: true,
      required: [true, 'A firm must have a name']
    },
    mainFirmName: {
      type: String,
      trim: true,
      maxlength: 40
    },
    mainFirmID: {
      type: String,
      trim: true,
      maxlength: 40
    },
    isCorporate: {
      type: Boolean,
      required: [true, 'A firm must have a corporate boolean info']
    },
    bayserNo: {
      type: String,
      maxlength: 40,
      trim: true,
      required: [true, 'A firm must have a bayserNo']
    },
    officialID: {
      type: String,
      maxlength: 40,
      trim: true,
      required: [true, 'A firm must have a officialId']
    },
    taxNumber: {
      type: String,
      maxlength: 40,
      trim: true,
      required: [true, 'A firm must have a taxNumber']
    },
    taxOffice: {
      type: String,
      trim: true,
      maxlength: 40,
      required: [true, 'A firm must have a taxOffice']
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      trim: true,
      maxlength: 50
    },
    tel: {
      type: String,
      required: [true, 'Please provide a telephone number'],
      trim: true,
      maxlength: 20
    },
    address: {
      text: { type: String, required: true, trim: true, maxlength: 100 },
      city: { type: String, required: true, trim: true, maxlength: 20 },
      town: { type: String, required: true, trim: true, maxlength: 20 }
    },
    isActive: {
      type: Boolean,
      default: true
    },
    productInfo: [
      {
        productName: { type: String, required: true, maxlength: 40 },
        quota: { type: Number, required: true },
        quotaWarning: { type: Number, required: true },
        quotaMax: { type: Number, required: true },
        syncLevel: { type: Number, required: true }
      }
    ],
    playMakers: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        lastName: { type: String, required: true }
      }
    ],
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
              type: mongoose.Schema.Types.Mixed,
              trim: true,
              required: [true, 'A updateInfo info must have a valueFrom']
            },
            valueTo: {
              type: mongoose.Schema.Types.Mixed,
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
    updateBill: [
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
        operation: {
          type: String,
          enum: ['Deleted', 'Added'],
          required: [true, 'Please provide a operation role']
        },
        info: {
          billNo: {
            type: String,
            trim: true,
            required: [true, 'A updateInfo info must have a info']
          },
          productCode: {
            type: String,
            trim: true,
            required: [true, 'A updateInfo info must have a valueFrom']
          },
          productName: {
            type: String,
            trim: true,
            required: [true, 'A updateInfo info must have a valueTo']
          },
          quota: {
            type: Number,
            trim: true,
            required: [true, 'A updateInfo info must have a valueTo']
          },
          income: {
            type: Number,
            trim: true,
            required: [true, 'A updateInfo info must have a valueTo']
          },
          price: {
            type: Number,
            trim: true,
            required: [true, 'A updateInfo info must have a valueTo']
          }
        },
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
    }
  },
  {
    strict: true
  }
);

const FirmLog = mongoose.model('FirmLog', firmLogSchema);

module.exports = FirmLog;
