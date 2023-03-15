const mongoose = require('mongoose');
const validator = require('validator');

const firmSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      maxlength: 40,
      trim: true,
      required: [true, 'A firm must have a name']
    },
    mainFirmName: {
      type: String,
      trim: true,
      maxlength: 40
    },
    mainFirmID: {
      type: String,
      trim: true,
      maxlength: 40
    },
    isCorporate: {
      type: Boolean,
      required: [true, 'A firm must have a corporate boolean info']
    },
    bayserNo: {
      type: String,
      maxlength: 40,
      trim: true,
      unique: true,
      required: [true, 'A firm must have a bayserNo']
    },
    officialID: {
      type: String,
      maxlength: 40,
      trim: true,
      required: [true, 'A firm must have a officialId']
    },
    taxNumber: {
      type: String,
      maxlength: 40,
      trim: true,
      required: [true, 'A firm must have a taxNumber']
    },
    taxOffice: {
      type: String,
      trim: true,
      maxlength: 40,
      required: [true, 'A firm must have a taxOffice']
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      trim: true,
      maxlength: 50,
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    tel: {
      type: String,
      required: [true, 'Please provide a telephone number'],
      trim: true,
      maxlength: 20,
      validator: { age: { $type: 'number', $mod: [1, 0] } }
    },
    address: {
      text: { type: String, required: true, trim: true, maxlength: 100 },
      city: { type: String, required: true, trim: true, maxlength: 20 },
      town: { type: String, required: true, trim: true, maxlength: 20 }
    },
    isActive: {
      type: Boolean,
      default: true
    },
    productInfo: [
      {
        productName: { type: String, required: true, maxlength: 40 },
        quota: { type: Number, required: true },
        quotaWarning: { type: Number, required: true },
        quotaMax: { type: Number, required: true },
        syncLevel: { type: Number, required: true }
      }
    ],
    playMakers: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        lastName: { type: String, required: true }
      }
    ],
    note: {
      type: String,
      default: ''
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
    required: ['location', 'productInfo']
  }
);

firmSchema.methods.addProductQuota = async function(productName, quotaToAdd) {
  const product = this.productInfo.find(p => p.productName === productName);
  if (product) {
    // eslint-disable-next-line radix
    product.quota += quotaToAdd;
  }
  return await this.save();
};

firmSchema.methods.deleteProductQuota = function(productName, quotaToAdd) {
  const product = this.productInfo.find(p => p.productName === productName);
  console.log(product);

  if (product.quota >= quotaToAdd && product) {
    // eslint-disable-next-line radix
    product.quota -= quotaToAdd;

    this.save();
    return true;
  }

  return false;
};

const Firm = mongoose.model('Firm', firmSchema);

module.exports = Firm;
