const mongoose = require('mongoose');

const testSchema = mongoose.Schema({
  settings: [
    {
      type: String,
      unique: true,
      maxlength: 40,
      trim: true,
      required: [true, 'A stock must have a product code']
    }
  ]
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;
