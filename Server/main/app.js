const createError = require('http-errors'); // Модуль TTP-ошибки используется для генерации ошибок для приложений Node.js.
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser'); // Промежуточные обработчики сторонних поставщиков ПО
const logger = require('morgan');  // Регистратор - при любых сделанных запросах он автоматически генерирует журналы.

const indexRouter = require('./routes');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //Встроенная функция промежуточного ПО в Express. Она обрабатывает входящие запросы с urlencoded полезной нагрузкой и основана на body-parser.
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

module.exports = app;

