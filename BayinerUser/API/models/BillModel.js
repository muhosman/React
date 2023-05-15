const mongoose = require('mongoose');

const billSchema = mongoose.Schema({
  billNo: {
    type: String,
    maxlength: 40,
    trim: true,
    required: [true, 'A bill must have a no']
  },
  firmApellation: {
    type: String,
    trim: true,
    maxlength: 40,
    required: [true, 'A bil must have a firm apellation']
  },
  bayserNo: {
    type: String,
    maxlength: 40,
    trim: true,
    required: [true, 'A bill must have a bayserNo']
  },
  shippingInfo: {
    type: String,
    maxlength: 40,
    trim: true,
    required: [true, 'A bill must have a shipping info']
  },
  productCode: {
    type: String,
    trim: true,
    maxlength: 40,
    required: [true, 'A bill must have a product code']
  },
  productName: {
    type: String,
    trim: true,
    maxlength: 40,
    required: [true, 'A bill must have a product name']
  },
  quota: {
    type: Number,
    trim: true,
    required: [true, 'A bill must have a quota']
  },
  income: {
    type: Number,
    trim: true,
    required: [true, 'A bill must have a price']
  },
  price: {
    type: Number,
    trim: true,
    required: [true, 'A bill must have a price']
  },
  createdInfo: {
    type: String,
    validator: {
      lastConnectionDate: { $regex: /^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/ }
    },
    required: [true, 'A bill must have a createdInfo']
  },
  updatedInfo: {
    type: String,
    validator: {
      lastConnectionDate: { $regex: /^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/ }
    },
    required: [true, 'A bill must have a updatedInfo']
  }
});

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;
