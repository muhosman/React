const mongoose = require('mongoose');

const productTypeModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product type has a name'],
      trim: true,
      unique: true,
      maxlength: 30
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
  },
  {
    strict: true
  }
);

const ProductType = mongoose.model('ProductType', productTypeModel);
module.exports = ProductType;
