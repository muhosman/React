const mongoose = require('mongoose');

const cityModel = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'City has a name'],
    trim: true,
    maxlength: 30
  }
});

const City = mongoose.model('City', cityModel);
module.exports = City;
