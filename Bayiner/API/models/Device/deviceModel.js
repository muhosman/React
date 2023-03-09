const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema(
  {
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
    connectionLevel: { type: Number, trim: true },
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
    createdInfo: {
      type: String,
      trim: true,
      validator: {
        lastConnectionDate: { $regex: /^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/ }
      },
      required: [true, 'A device must have a createdInfo']
    },
    updatedInfo: {
      type: String,
      trim: true,
      validator: {
        lastConnectionDate: { $regex: /^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/ }
      },
      required: [true, 'A device must have a updatedInfo']
    }
  },
  {
    strict: true
  }
);

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
