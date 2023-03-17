const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Firm = require('../models/firmModel');
const User = require('./../models/userModel');
const Device = require('./../models/Device/deviceModel');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const dateAndHour = function() {
  const currentDate = new Date(Date.now());
  const formattedDate = currentDate.toLocaleString('tr-TR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
  return formattedDate;
};

exports.getAllFirms = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Firm.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const Firms = await features.query;

  res.status(200).json({
    status: 'success',
    results: Firms.length,
    data: {
      Firms
    }
  });
});

exports.getDeviceByFirmID = catchAsync(async (req, res, next) => {
  const devices = await Device.find({ firmID: req.params.id });

  if (!devices) {
    return next(new AppError('No device service found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      devices
    }
  });
});

exports.updateFirmSyncSetting = catchAsync(async (req, res, next) => {
  const firm = await Firm.findById(req.params.id);

  if (!firm) {
    return next(new AppError('No firm found with that ID', 404));
  }

  const productToUpdate = firm.productInfo.find(
    product => product.productName === req.body.productName
  );

  if (!productToUpdate) {
    return next(new AppError('No product found with that name', 404));
  }

  productToUpdate.quotaWarning = req.body.quotaWarning;
  productToUpdate.quotaMax = req.body.quotaMax;
  productToUpdate.syncLevel = req.body.syncLevel;

  await firm.save();

  const devices = await Device.find({ firmID: firm._id });

  devices.forEach(device => {
    const productToUpdateDevice = device.productInfo.find(
      product => product.productName === productToUpdate.productName
    );

    if (productToUpdateDevice !== undefined) {
      productToUpdateDevice.quotaWarning = req.body.quotaWarning;
      productToUpdateDevice.quotaMax = req.body.quotaMax;
      productToUpdateDevice.syncLevel = req.body.syncLevel;

      device.save();
    }
  });

  res.status(200).json({
    status: 'success'
  });
});

exports.divideFirmQuotaToDevice = catchAsync(async (req, res, next) => {
  // Firm ID'sini istek parametrelerinden alın
  const firmID = req.params.id;
  const { productName } = req.body;
  // Firmayı bulun
  const firm = await Firm.findById(firmID);

  if (!firm) {
    return next(new AppError('No firm found with that id', 404));
  }
  // Tüm cihazlardaki ürün bilgisi dizilerini alın
  const productInfoArrays = await Device.find({
    firmID,
    statusName: 'Firma',
    isActive: true
  }).distinct('productInfo');

  if (!productInfoArrays) {
    return next(new AppError('No device found with that product name', 404));
  }

  // Toplam kotayı hesaplayın
  let totalQuota = 0;
  let numDevices = 0;

  for (let i = 0; i < productInfoArrays.length; i += 1) {
    if (productName === productInfoArrays[i].productName) {
      totalQuota += productInfoArrays[i].quota;
      numDevices += 1;
    }
  }

  const firmProductInfo = firm.productInfo;
  let indexFirm = -1;
  for (let i = 0; i < firmProductInfo.length; i += 1) {
    // eslint-disable-next-line no-plusplus
    if (firmProductInfo[i].productName === productName) {
      totalQuota += firmProductInfo[i].quota;
      indexFirm = i;
      break;
    }
  }

  if (indexFirm === -1) {
    return next(new AppError('No firm found with that product name', 404));
  }
  // Her cihaz için eşit dağıtılacak kotayı hesaplayın
  const perDeviceQuota = Math.ceil(totalQuota / numDevices);

  if (perDeviceQuota < 30) {
    return next(
      new AppError('The total quota that you want to divide is very low', 404)
    );
  }

  // Tüm cihazların ürün bilgisi dizilerini alın
  const devices = await Device.find({
    firmID,
    statusName: 'Firma',
    isActive: true
  });
  // Tüm cihazların ürün bilgisi dizilerindeki productName'e sahip olanların kotayı eşit dağıtın
  devices.forEach(device => {
    const productInfo = device.productInfo.find(
      product => product.productName === productName
    );

    if (productInfo) {
      if (totalQuota <= perDeviceQuota) {
        // son cihazın kotayı toplam kota ile doldur
        productInfo.quota = totalQuota;
        totalQuota = 0;
      } else {
        // diğer cihazlara perDeviceQuota kadar kota ver
        productInfo.quota = perDeviceQuota;
        totalQuota -= perDeviceQuota;
      }
      device.save();
    }
  });

  firm.productInfo[indexFirm].quota = totalQuota;
  firm.save();

  res.status(200).json({
    status: 'success'
  });
});

exports.getFirmSyncSettingsByID = catchAsync(async (req, res, next) => {
  const firm = await Firm.findById(req.params.id);

  if (!firm) {
    return next(new AppError('No firm found with that ID', 404));
  }
  const Devices = await Device.find({ firmID: firm._id });

  const quotaArray = [];

  // eslint-disable-next-line no-shadow, array-callback-return
  Devices.map(Device => {
    // eslint-disable-next-line array-callback-return
    Device.productInfo.map(item => {
      const existingQuota = quotaArray.find(
        arr => arr.name === item.productName
      );
      if (existingQuota) {
        existingQuota.quota += item.quota;
      } else {
        quotaArray.push({ name: item.productName, quota: item.quota });
      }
    });
  });

  res.status(200).json({
    status: 'success',
    data: {
      productInfoes: firm.productInfo,
      quotaArray: quotaArray
    }
  });
});

exports.getFirmQuota = catchAsync(async (req, res, next) => {
  const firm = await Firm.findById(req.params.id);

  if (!firm) {
    return next(new AppError('No firm found with that ID', 404));
  }
  const Devices = await Device.find({ firmID: firm._id });

  const quotaArray = [];

  // eslint-disable-next-line no-shadow, array-callback-return
  Devices.map(Device => {
    // eslint-disable-next-line array-callback-return
    Device.productInfo.map(item => {
      const existingQuota = quotaArray.find(
        arr => arr.name === item.productName
      );
      if (existingQuota) {
        existingQuota.quota += item.quota;
      } else {
        quotaArray.push({ name: item.productName, quota: item.quota });
      }
    });
  });
  res.status(200).json({
    status: 'success',
    data: {
      quotaArray: quotaArray
    }
  });
});

exports.getFirmByID = catchAsync(async (req, res, next) => {
  const firm = await Firm.findById(req.params.id);

  if (!firm) {
    return next(new AppError('No device service found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      firm
    }
  });
});

exports.getBelowFirmsByID = catchAsync(async (req, res, next) => {
  const firms = await Firm.find({ mainFirmID: req.params.id });

  if (!firms) {
    return next(new AppError('No device service found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      firms
    }
  });
});

exports.getUsersByFirmID = catchAsync(async (req, res, next) => {
  const users = await User.find({ firmID: req.params.id });
  if (!users) {
    return next(new AppError('No user found with that Firm ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      users
    }
  });
});

exports.createFirm = catchAsync(async (req, res, next) => {
  const firms = await Firm.find({});
  const usedNumbers = new Set(
    firms.map(firm => {
      // eslint-disable-next-line radix
      const number = parseInt(firm.bayserNo);
      // eslint-disable-next-line no-restricted-globals
      return isNaN(number) ? 0 : number;
    })
  );
  let maxBayserNo = -Infinity;
  if (usedNumbers.size > 0) {
    maxBayserNo = Math.max(...usedNumbers);
  }
  let newBayserNo = 1;
  for (let i = 1; i <= maxBayserNo + 1; i += 1) {
    if (!usedNumbers.has(i)) {
      newBayserNo = i;
      break;
    }
  }
  const filteredBody = filterObj(req.body, 'isCorporate', 'mainFirmID');

  if (filteredBody.isCorporate === false) {
    await Firm.create({
      ...req.body,
      bayserNo: newBayserNo,
      createdInfo: dateAndHour(),
      updatedInfo: dateAndHour()
    });
  } else if (filteredBody.isCorporate === true) {
    const filteredObj = filterObj(
      req.body,
      'name',
      'isCorporate',
      'officialID',
      'taxNumber',
      'taxOffice',
      'email',
      'tel',
      'address'
    );

    await Firm.create({
      ...filteredObj,
      bayserNo: newBayserNo,
      createdInfo: dateAndHour(),
      updatedInfo: dateAndHour()
    });
  } else
    return next(new AppError('Mainfirm ID and isCorporate not proper.', 404));

  res.status(201).json({
    status: 'success'
  });
});

exports.updateFirmInfo = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'isCorporate', 'mainFirmID');

  let updatedFirm;

  if (filteredBody.isCorporate === true) {
    const playMakersWithDetails = await Promise.all(
      req.body.playMakers.map(async playMakerId => {
        const playMakerUser = await User.findById(playMakerId.id);
        return {
          id: playMakerUser._id,
          name: playMakerUser.name,
          lastName: playMakerUser.lastName
        };
      })
    );

    const filteredObj = filterObj(
      {
        ...req.body,
        playMakers: playMakersWithDetails
      },
      'name',
      'isCorporate',
      'officialID',
      'taxNumber',
      'taxOffice',
      'email',
      'tel',
      'address',
      'isActive',
      'playMakers',
      'note'
    );

    updatedFirm = await Firm.findByIdAndUpdate(
      req.params.id,
      {
        ...filteredObj,
        mainFirmID: '',
        mainFirmName: '',
        updatedInfo: dateAndHour()
      },
      {
        new: true,
        runValidators: true
      }
    );
  } else {
    updatedFirm = await Firm.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedInfo: dateAndHour()
      },
      {
        new: true,
        runValidators: true
      }
    );
  }

  if (updatedFirm.playMakers && updatedFirm.playMakers.length > 0) {
    await Promise.all(
      updatedFirm.playMakers.map(async playMaker => {
        await User.findByIdAndUpdate(
          playMaker.id,
          {
            $addToSet: {
              firms: { firmID: updatedFirm._id, firmName: updatedFirm.name }
            }
          },
          {
            new: true,
            runValidators: true
          }
        );
      })
    );
  }

  res.status(200).json({
    status: 'success'
  });
});

exports.deleteFirm = catchAsync(async (req, res, next) => {
  const firm = await Firm.findById(req.params.id);
  const mainFirm = await Firm.findOne({ bayserNo: '1' });
  if (!firm) {
    return next(new AppError('No firm found with that ID', 404));
  }
  if (!mainFirm) {
    return next(new AppError('No main firm found with that ID', 404));
  }
  if (firm.isActive === true || firm.bayserNo === 1) {
    return next(
      new AppError(
        'You can not delete firm bayserNo is one or it is active firm',
        404
      )
    );
  }

  await Device.updateMany(
    { firmID: req.params.id },
    { $set: { firmID: mainFirm._id } }
  );
  const deletedFirm = await Firm.findByIdAndDelete(req.params.id);

  if (!deletedFirm) {
    return next(new AppError('No firm found with that ID', 404));
  }

  await Firm.updateMany(
    { mainFirmID: req.params.id },
    { $set: { mainFirmID: '', mainFirmName: '', isCorporate: true } }
  );

  res.status(204).json({
    status: 'success'
  });
});
