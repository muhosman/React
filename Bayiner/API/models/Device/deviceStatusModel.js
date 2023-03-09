const mongoose = require('mongoose');

const deviceStatusModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Devicestatus has a name'],
      trim: true,
      maxlength: 40
    },
    createdInfo: {
      type: String,
      validator: {
        lastConnectionDate: { $regex: /^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/ }
      },
      required: [true, 'A Devicestatus must have a createdInfo']
    },
    updatedInfo: {
      type: String,
      validator: {
        lastConnectionDate: { $regex: /^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/ }
      },
      required: [true, 'A Devicestatus must have a updatedInfo']
    }
  },
  {
    strict: true
  }
);

const DeviceStatus = mongoose.model('DeviceStatus', deviceStatusModel);
module.exports = DeviceStatus;
