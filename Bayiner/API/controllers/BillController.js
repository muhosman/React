const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Bill = require('./../models/BillModel');
const ProductInfo = require('./../models/Product/productInfoModel');
const Firm = require('../models/firmModel');
const Stock = require('./../models/stockModel');
const Device = require('./../models/Device/deviceModel');

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

exports.getAllBills = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Bill.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const bills = await features.query;

  res.status(200).json({
    status: 'success',
    results: bills.length,
    data: {
      bills
    }
  });
});

exports.getBill = catchAsync(async (req, res, next) => {
  const firm = await Firm.findById(req.params.id);
  const bills = await Bill.find({ bayserNo: firm.bayserNo });

  if (!bills) {
    return next(new AppError('No bill found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    results: bills.length,
    data: {
      bills
    }
  });
});

exports.createBill = catchAsync(async (req, res, next) => {
  const { bills } = req.body;
  const quotasToAdd = [];
  const quotasToAddStock = [];
  const successfulBills = [];

  await Promise.all(
    bills.map(async billData => {
      const {
        billNo,
        firmApellation,
        bayserNo,
        shippingInfo,
        productCode,
        quota,
        income,
        price
      } = billData;
      const billObj = { ...billData };

      // Check if a bill with the same billNo already exists
      const existingBill = await Bill.findOne({ billNo, productCode });

      if (existingBill) {
        return;
      }
      // Retrieve the productInfo object associated with the productCode provided
      const productInfo = await ProductInfo.findOne({ code: productCode });

      if (productInfo) {
        // Check that the firm associated with the bayserNo provided exists
        const firm = await Firm.findOne({ bayserNo });

        if (firm) {
          // Add the typeName and quota objects to the quotasToAdd array
          const { typeName } = productInfo;
          const quotaObj = { typeName, quota, bayserNo };
          const quotaObjStock = { productCode, quota };

          const product = firm.productInfo.find(
            p => p.productName === typeName
          );

          if (product) {
            const existingQuota = quotasToAdd.find(
              q => q.typeName === typeName && q.bayserNo === bayserNo
            );

            if (existingQuota) {
              existingQuota.quota += quota;
            } else {
              quotasToAdd.push(quotaObj);
            }

            const existingQuotaStock = quotasToAddStock.find(
              q => q.productCode === productCode
            );

            if (existingQuotaStock) {
              existingQuotaStock.quota += quota;
            } else {
              quotasToAddStock.push(quotaObjStock);
            }

            const bill = new Bill({
              billNo,
              firmApellation,
              bayserNo,
              shippingInfo,
              productCode,
              productName: productInfo.name,
              quota,
              income,
              price,
              createdInfo: dateAndHour(),
              updatedInfo: dateAndHour()
            });
            if (bill.bayserNo === 4) console.log(bill);
            await bill.save();
            billObj.failureMessage = 'Fatura başarıyla yüklendi !';
            successfulBills.push(billObj);
          }
        }
      }
    })
  );

  // eslint-disable-next-line no-shadow
  quotasToAddStock.map(async quotaObj => {
    // eslint-disable-next-line no-shadow
    const { productCode, quota } = quotaObj;

    // Find the stock entry for the given productCode
    const stockEntry = await Stock.findOne({ productCode });

    if (stockEntry) {
      // If a stock entry is found, update its quota
      stockEntry.deleteProductQuota(quota);
    }
  });

  // eslint-disable-next-line no-shadow
  quotasToAdd.map(async quotaObj => {
    // eslint-disable-next-line no-shadow
    const { typeName, quota, bayserNo } = quotaObj;
    // eslint-disable-next-line no-shadow
    const firm = await Firm.findOne({ bayserNo });
    firm.addProductQuota(typeName, quota);
  });

  if (successfulBills.length === 0) {
    return next(new AppError('We didnt upload any bill', 404));
  }

  res.status(201).json({
    status: 'success',
    bills: successfulBills,
    results: successfulBills.length
  });
});

exports.controlBill = catchAsync(async (req, res, next) => {
  const { bills } = req.body;

  const result = bills.map(async billData => {
    const { billNo, bayserNo, productCode } = billData;

    const billObj = { ...billData }; // create a copy of the bill object

    // Check if a bill with the same billNo already exists
    const existingBill = await Bill.findOne({ billNo });
    if (existingBill) {
      billObj.failureMessage = `Hali hazırda bu fatura numarası ile bir fatura zaten mevuct !`;
      return billObj;
    }

    // Retrieve the productInfo object associated with the productCode provided
    const productInfo = await ProductInfo.findOne({ code: productCode });
    if (!productInfo) {
      billObj.failureMessage = `Kestiğiniz faturada ki ürün kodu, sistem tanımlı değil !`;
      return billObj;
    }

    // Check that the firm associated with the bayserNo provided exists
    const firm = await Firm.findOne({ bayserNo });

    if (!firm) {
      billObj.failureMessage = `Faturayı kestiğiniz firmanın bayser numarası sistemde mevcut değil !`;
      return billObj;
    }

    const product = firm.productInfo.find(
      p => p.productName === productInfo.typeName
    );

    if (!product) {
      billObj.failureMessage = `Bu firma bu ürüne sahip değil !`;
      return billObj;
    }

    billObj.failureMessage = 'Fatura yüklenmeye hazır !';

    return billObj;
  });

  const results = await Promise.all(result); // wait for all promises to resolve

  res.status(201).json({
    status: 'success',
    results: bills.length,
    bills: results
  });
});

exports.deleteBill = catchAsync(async (req, res, next) => {
  const bill = await Bill.findById(req.params.id);

  if (!bill) {
    return next(new AppError('No bill found with that ID', 404));
  }

  const { bayserNo, productCode, quota } = bill;

  // Retrieve the productInfo object associated with the productCode provided
  const productInfo = await ProductInfo.findOne({ code: productCode });

  if (!productInfo) {
    return next(
      new AppError('No product info found with that product code', 404)
    );
  }

  // Check that the firm associated with the bayserNo provided exists
  const firm = await Firm.findOne({ bayserNo });

  if (!firm) {
    return next(new AppError('No firm found with that bayserNo', 404));
  }

  // Toplam kotayı hesaplayın
  let totalQuota = 0;
  let numDevices = 0;

  const firmProductInfo = firm.productInfo;
  let indexFirm = -1;
  for (let i = 0; i < firmProductInfo.length; i += 1) {
    // eslint-disable-next-line no-plusplus
    if (firmProductInfo[i].productName === productInfo.typeName) {
      totalQuota += firmProductInfo[i].quota;
      indexFirm = i;
      break;
    }
  }

  if (indexFirm === -1) {
    return next(new AppError('No firm found with that product name', 404));
  }

  if (!(totalQuota >= bill.quota)) {
    // Tüm cihazlardaki ürün bilgisi dizilerini alın
    const productInfoArrays = await Device.find({
      firmID: firm._id,
      statusName: 'Firma',
      isActive: true
    }).distinct('productInfo');

    if (!productInfoArrays) {
      return next(new AppError('No device found with that product name', 404));
    }

    for (let i = 0; i < productInfoArrays.length; i += 1) {
      if (productInfo.typeName === productInfoArrays[i].productName) {
        totalQuota += productInfoArrays[i].quota;
        numDevices += 1;
      }
    }

    if (!(totalQuota > bill.quota)) {
      return next(new AppError('Total quota is not needed', 404));
    }

    totalQuota -= bill.quota;
    // Her cihaz için eşit dağıtılacak kotayı hesaplayın
    const perDeviceQuota = Math.ceil(totalQuota / numDevices);

    if (perDeviceQuota < 30) {
      return next(
        new AppError('The total quota that you want to divide is very low', 404)
      );
    }

    // Tüm cihazların ürün bilgisi dizilerini alın
    const devices = await Device.find({
      firmID: firm._id,
      statusName: 'Firma',
      isActive: true
    });

    // Tüm cihazların ürün bilgisi dizilerindeki productName'e sahip olanların kotayı eşit dağıtın
    devices.forEach(device => {
      const deviceProductInfo = device.productInfo.find(
        product => product.productName === productInfo.typeName
      );

      if (deviceProductInfo) {
        if (totalQuota <= perDeviceQuota) {
          // son cihazın kotayı toplam kota ile doldur
          deviceProductInfo.quota = totalQuota;
          totalQuota = 0;
        } else {
          // diğer cihazlara perDeviceQuota kadar kota ver
          deviceProductInfo.quota = perDeviceQuota;
          totalQuota -= perDeviceQuota;
        }
        device.save();
      }
    });
  } else totalQuota -= bill.quota;

  // Find the stock entry for the given productCode
  const stockEntry = await Stock.findOne({ productCode });
  if (stockEntry) {
    // If a stock entry is found, update its quota
    stockEntry.addProductQuota(quota);
  }
  await bill.delete();

  firm.productInfo[indexFirm].quota = totalQuota;
  await firm.save();

  res.status(204).json({
    status: 'success'
  });
});
