const path = require('path');
const express = require('express');
const cors = require('cors');

const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const billRouter = require('./routes/billRoutes');
const stockRouter = require('./routes/stockRoutes');
const deviceLogRouter = require('./routes/Device/deviceLogRoutes');
const deviceRouter = require('./routes/Device/deviceRoutes');
const deviceTypeRouter = require('./routes/Device/deviceTypeRoutes');
const deviceServiceRouter = require('./routes/Device/deviceServiceRoutes');
const deviceStatusRouter = require('./routes/Device/deviceStatusRoutes');
const deviceSettingRouter = require('./routes/Device/deviceSettingRoutes');
const productInfoRouter = require('./routes/Product/productInfoRoutes');
const productTypeRouter = require('./routes/Product/productTypeRoutes');
const firmRouter = require('./routes/firmRoutes');
const testRouter = require('./routes/testRoutes');
const cityRouter = require('./routes/utils/cityRoutes');
const townRouter = require('./routes/utils/townRoutes');
const dashBoardDevice = require('./routes/dashBoard');

const app = express();
app.use(cors());
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// 1) GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, `public`)));

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 3000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '100mb' }));

app.use(cookieParser());
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.get('/', (req, res) => {
  res.status(200).render('base');
});

//Device Routes
app.use('/deviceLog', deviceLogRouter);
app.use('/devices', deviceRouter);
app.use('/deviceTypes', deviceTypeRouter);
app.use('/deviceSettings', deviceSettingRouter);
app.use('/deviceServices', deviceServiceRouter);
app.use('/deviceStatuses', deviceStatusRouter);

//Firm Routes
app.use('/firms', firmRouter);
// Product Routes
app.use('/productInfoes', productInfoRouter);
app.use('/productTypes', productTypeRouter);
app.use('/testRoute', testRouter);
app.use('/city', cityRouter);
app.use('/town', townRouter);
app.use('/users', userRouter);
app.use('/stock', stockRouter);
app.use('/bills', billRouter);

//Dashobard
app.use('/dashBoard', dashBoardDevice);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
