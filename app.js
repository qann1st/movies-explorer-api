const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes');
const { error } = require('./middlewares/errorMiddleware');
const {
  requestLogger,
  errorLogger,
} = require('./middlewares/loggerMiddleware');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
require('dotenv').config();

const allowDomains = [
  'https://api.movies.qann1st.site',
  'http://localhost:3000',
  'http://movies.qann1st.site',
  'https://movies.qann1st.site'
];
const corsOptions = {
  origin(origin, callback) {
    if (allowDomains.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Ваш домен не находится в списке разрешенных'));
    }
  },
  methods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  credentials: true,
};

const start = async (req, res, next) => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb');

    const app = express();
    app.use(requestLogger);
    app.use(express.json());
    app.use(helmet());
    app.use(cors(corsOptions));
    app.use(cookieParser());

    app.get('/crash-test', () => {
      setTimeout(() => {
        throw new Error('Сервер сейчас упадёт');
      }, 0);
    });

    app.use('/', router);
    app.use(errorLogger);
    app.use(errors());
    app.use(error);

    app.listen('4000', () => {
      console.log('Server started');
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

start();
