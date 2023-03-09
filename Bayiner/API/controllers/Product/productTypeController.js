const APIFeatures = require('../../utils/apiFeatures');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const ProductType = require('../../models/Product/productTypeModel');

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

exports.getAllProductTypes = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(ProductType.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const productTypes = await features.query;

  res.status(200).json({
    status: 'succeses',
    results: productTypes.length,
    data: {
      productTypes
    }
  });
});

exports.getProductType = catchAsync(async (req, res, next) => {
  const productType = await ProductType.findById(req.params.id);

  if (!productType) {
    return next(new AppError('No product type found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      productType
    }
  });
});

exports.createProductType = catchAsync(async (req, res) => {
  const newProductType = await ProductType.create({
    ...req.body,
    createdInfo: dateAndHour(),
    updatedInfo: dateAndHour()
  });

  res.status(201).json({
    status: 'success',
    data: {
      productType: newProductType
    }
  });
});

exports.updateProductType = catchAsync(async (req, res, next) => {
  const productType = await ProductType.findByIdAndUpdate(
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

  if (!productType) {
    return next(new AppError('No product type found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      productType
    }
  });
});

exports.deleteProductType = catchAsync(async (req, res, next) => {
  const productType = await ProductType.findByIdAndDelete(req.params.id);

  if (!productType) {
    return next(new AppError('No product type found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: {
      productType
    }
  });
});
