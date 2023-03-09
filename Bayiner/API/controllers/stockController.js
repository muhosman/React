const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Stock = require('./../models/stockModel');

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

exports.getAllStocks = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Stock.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const stocks = await features.query;

  res.status(200).json({
    status: 'success',
    results: stocks.length,
    data: {
      stocks
    }
  });
});

exports.createStock = catchAsync(async (req, res, next) => {
  // Tüm productInfoları al

  // Oluşturulan tüm stock objelerini döndür
  res.status(201).json({
    status: 'success'
  });
});

exports.getStock = catchAsync(async (req, res, next) => {
  const stock = await Stock.findById(req.params.id);

  if (!stock) {
    return next(new AppError('No stock found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      stock
    }
  });
});

exports.createStock = catchAsync(async (req, res, next) => {
  const newStock = await Stock.create({
    ...req.body,
    createdInfo: dateAndHour(),
    updatedInfo: dateAndHour()
  });

  res.status(201).json({
    status: 'success',
    data: {
      stock: newStock
    }
  });
});

exports.updateStock = catchAsync(async (req, res, next) => {
  const stock = await Stock.findById(req.params.id);

  // eslint-disable-next-line radix
  const newQuota = stock.quota + parseInt(req.body.quota);

  console.log(newQuota);
  const updatedStock = await Stock.findByIdAndUpdate(
    req.params.id,
    {
      quota: newQuota,
      updatedInfo: dateAndHour()
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!updatedStock) {
    return next(new AppError('No stock found with that ID', 404));
  }

  res.status(200).json({
    status: 'success'
  });
});

exports.deleteStock = catchAsync(async (req, res, next) => {
  const stock = await Stock.findByIdAndDelete(req.params.id);

  if (!stock) {
    return next(new AppError('No stock found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
