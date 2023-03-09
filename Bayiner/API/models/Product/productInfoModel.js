const mongoose = require('mongoose');

const productInfoModel = new mongoose.Schema(
  {
    typeName: {
      type: String,
      required: [true, 'Product has a type'],
      trim: true,
      maxlength: 30
    },
    name: {
      type: String,
      required: [true, 'Product has a name'],
      trim: true,
      unique: true,
      maxlength: 40
    },
    code: {
      type: String,
      required: [true, 'Product has a code'],
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

const ProductInfo = mongoose.model('ProductInfo', productInfoModel);
module.exports = ProductInfo;
