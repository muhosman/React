const mongoose = require('mongoose');

const deviceTypeModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Device type has a name'],
      trim: true,
      unique: true,
      maxlength: 40
    },
    settingType: {
      type: [
        {
          cupNumber: {
            type: Number,
            required: true,
            trim: true,
            max: 4,
            min: 0
          },
          settingID: {
            type: String,
            required: true,
            trim: true,
            maxlength: 40
          }
        }
      ],
      required: [true, 'A device type must have setting']
    },
    createdInfo: {
      type: String,
      validator: {
        lastConnectionDate: { $regex: /^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/ }
      },
      required: [true, 'A device type must have a createdInfo']
    },
    updatedInfo: {
      type: String,
      validator: {
        lastConnectionDate: { $regex: /^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/ }
      },
      required: [true, 'A device type must have a updatedInfo']
    }
  },
  {
    strict: true
  }
);

const DeviceType = mongoose.model('DeviceType', deviceTypeModel);
module.exports = DeviceType;
