const mongoose = require('mongoose');

const deviceServiceModel = new mongoose.Schema({
  type: {
    type: String,
    enum: ['fault', 'error'],
    required: [true, 'Please provide a service type'],
    maxlength: 40
  },
  serviceCode: {
    type: Number,
    required: [true, 'Service has a code'],
    trim: true,
    maxlength: 40
  },
  info: {
    type: String,
    required: [true, 'Service has an explanation info'],
    trim: true,
    maxlength: 40
  },
  deviceSettingID: {
    type: String,
    required: [true, 'Service has a device type ID'],
    trim: true,
    maxlength: 40
  },
  solutionStep: {
    type: [{ type: String, required: true, trim: true, maxlength: 100 }],
    required: [true, 'A device must have solution step']
  },
  note: {
    type: String,
    maxlength: 100
  },
  createdInfo: {
    type: String,
    validator: {
      lastConnectionDate: { $regex: /^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/ }
    },
    required: [true, 'A device must have a createdInfo']
  },
  updatedInfo: {
    type: String,
    validator: {
      lastConnectionDate: { $regex: /^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/ }
    },
    required: [true, 'A device must have a updatedInfo']
  }
});

const DeviceService = mongoose.model('DeviceService', deviceServiceModel);
module.exports = DeviceService;
