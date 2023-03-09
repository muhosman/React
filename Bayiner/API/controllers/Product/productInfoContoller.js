const APIFeatures = require('../../utils/apiFeatures');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const ProductInfo = require('../../models/Product/productInfoModel');
const ProductType = require('../../models/Product/productTypeModel');
const Stock = require('../../models/stockModel');

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

exports.getAllProductInfoes = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(ProductInfo.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const productInfoes = await features.query;

  res.status(200).json({
    status: 'succeses',
    results: productInfoes.length,
    data: {
      productInfoes
    }
  });
});

exports.getProductInfo = catchAsync(async (req, res, next) => {
  const productInfo = await ProductInfo.findById(req.params.id);

  if (!productInfo) {
    return next(new AppError('No product info found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      productInfo
    }
  });
});

exports.createProductInfo = catchAsync(async (req, res, next) => {
  const productType = await ProductType.findOne({
    name: req.body.typeName
  });
  if (!productType) {
    return res.status(400).json({
      status: 'fail',
      message: `Invalid product type name: ${req.body.productTypeName}`
    });
  }

  const newProductInfo = await ProductInfo.create({
    ...req.body,
    createdInfo: dateAndHour(),
    updatedInfo: dateAndHour()
  });
  // Create a new stock object with the product code, name, and type
  // from the new product info, and set its quota to 0
  const newStock = await Stock.create({
    productID: newProductInfo._id,
    productCode: newProductInfo.code,
    productName: newProductInfo.name,
    productType: newProductInfo.typeName,
    quota: 0,
    createdInfo: dateAndHour(),
    updatedInfo: dateAndHour()
  });

  res.status(201).json({
    status: 'success',
    data: {
      productInfo: newProductInfo,
      stock: newStock
    }
  });
});

exports.updateProductInfo = catchAsync(async (req, res, next) => {
  const productInfo = await ProductInfo.findByIdAndUpdate(
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

  if (!productInfo) {
    return next(new AppError('No product info found with that ID', 404));
  }
  // Find the stock object with the same product code as the updated product info
  const stock = await Stock.findOne({ productID: productInfo._id });

  if (stock) {
    // Update the stock object with the updated product name and type
    stock.productCode = productInfo.code;
    stock.productName = productInfo.name;
    stock.productType = productInfo.typeName;
    stock.updatedInfo = dateAndHour();
    await stock.save();
  }

  res.status(200).json({
    status: 'success',
    data: {
      productInfo
    }
  });
});

exports.deleteProductInfo = catchAsync(async (req, res, next) => {
  const productInfo = await ProductInfo.findByIdAndDelete(req.params.id);

  if (!productInfo) {
    return next(new AppError('No product info found with that ID', 404));
  }

  // Find the stock object with the same product code as the deleted product info
  const stock = await Stock.findOne({ productID: productInfo._id });

  if (stock) {
    // If a stock object exists, delete it
    await stock.remove();
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
