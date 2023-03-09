const mongoose = require('mongoose');

const stockSchema = mongoose.Schema({
  productID: {
    type: String,
    unique: true,
    maxlength: 40,
    trim: true,
    required: [true, 'A stock must have a product code']
  },
  productCode: {
    type: String,
    unique: true,
    maxlength: 40,
    trim: true,
    required: [true, 'A stock must have a product code']
  },
  productName: {
    type: String,
    validator: {
      lastConnectionDate: { $regex: /^\d{2}\.\d{2}\.\d{4}$/ }
    },
    required: [true, 'A stock must have a product name']
  },
  productType: {
    type: String,
    validator: {
      lastConnectionDate: { $regex: /^\d{2}\.\d{2}\.\d{4}$/ }
    },
    required: [true, 'A stock must have a product type']
  },
  quota: {
    type: Number,
    trim: true,
    required: [true, 'A stock must have a quota']
  },
  createdInfo: {
    type: String,
    validator: {
      lastConnectionDate: { $regex: /^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/ }
    },
    required: [true, 'A stock must have a createdInfo']
  },
  updatedInfo: {
    type: String,
    validator: {
      lastConnectionDate: { $regex: /^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/ }
    },
    required: [true, 'A stock must have a updatedInfo']
  }
});

stockSchema.methods.addProductQuota = async function(quotaToAdd) {
  this.quota += quotaToAdd;
  return await this.save();
};
stockSchema.methods.deleteProductQuota = async function(quotaToAdd) {
  this.quota -= quotaToAdd;
  return await this.save();
};

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;
