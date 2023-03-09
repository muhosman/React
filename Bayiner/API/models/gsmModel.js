const mongoose = require('mongoose');

const gsmModel = new mongoose.Schema({
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
        required: true,
        unique: true
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
  ]
});

const GsmInfo = mongoose.model('GsmInfo', gsmModel);
module.exports = GsmInfo;
