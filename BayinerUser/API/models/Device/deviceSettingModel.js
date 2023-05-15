const mongoose = require('mongoose');

const deviceSettingModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Device setting has a name'],
      trim: true,
      unique: true,
      maxlength: 40
    },
    productName: {
      type: String,
      required: [true, 'A device setting must have product name'],
      trim: true,
      unique: true,
      maxlength: 40
    },
    quota: {
      type: Number,
      required: [true, 'Devic setting has a quota'],
      trim: true,
      max: 200,
      min: 0
    },
    quotaMax: {
      type: Number,
      required: [true, 'Device setting has a quotaMax'],
      trim: true,
      max: 20000,
      min: 1000
    },
    quotaWarning: {
      type: Number,
      required: [true, 'Device setting has a quotaWarning'],
      trim: true,
      max: 1000,
      min: 100
    },
    syncLevel: {
      type: Number,
      required: [true, 'Device setting has a syncLevel'],
      trim: true,
      max: 1000,
      min: 50
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
    createdInfo: {
      type: String,
      validator: {
        lastConnectionDate: { $regex: /^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/ }
      },
      required: [true, 'A device setting must have a createdInfo']
    },
    updatedInfo: {
      type: String,
      validator: {
        lastConnectionDate: { $regex: /^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/ }
      },
      required: [true, 'A device setting must have a updatedInfo']
    }
  },
  {
    strict: true
  }
);

deviceSettingModel.pre('save', function(next) {
  if (this.generalSettingRow.length === 0 || this.cupSettingRow.length === 0) {
    return next(new Error('SettingsColumn and SettingsRow cannot be empty'));
  }
  next();
});

const DeviceSetting = mongoose.model('DeviceSetting', deviceSettingModel);
module.exports = DeviceSetting;
