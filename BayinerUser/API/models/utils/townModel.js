const mongoose = require('mongoose');

const townModel = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Town has a name'],
    trim: true,
    maxlength: 30
  }
});

const Town = mongoose.model('Town', townModel);
module.exports = Town;
