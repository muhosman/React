const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: [
        'admin',
        'management',
        'playmaker',
        'firm',
        'dealer',
        'accounting',
        'manufacture'
      ],
      default: 'user',
      required: [true, 'Please provide a user role']
    },
    name: {
      type: String,
      required: [true, 'Please tell us your name!']
    },
    lastName: {
      type: String,
      required: [true, 'Please tell us your last name!']
    },
    firms: {
      type: [{ firmID: String, firmName: String }],
      trim: true
    },
    firmID: {
      type: String,
      trim: true,
      required: [true, 'Firm name is required !']
    },
    firmName: {
      type: String,
      trim: true,
      required: [true, 'Firm name is required !']
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    tel: {
      type: String,
      required: [true, 'Please provide a telephone number'],
      validator: { age: { $type: 'number', $mod: [1, 0] } }
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function(el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!'
      }
    },
    isActive: {
      type: Boolean,
      default: true,
      required: [true, 'Please provide a activity']
    },
    createdInfo: {
      type: String,
      validator: {
        lastConnectionDate: { $regex: /^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/ }
      }
    },
    updatedInfo: {
      type: String,
      validator: {
        lastConnectionDate: { $regex: /^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/ }
      }
    },
    passwordResetToken: String
  },
  {
    strict: true
  }
);

userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function(next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }
  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
