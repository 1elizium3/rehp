/*
  Файл содержит все express маршруты,
    которые позволит отправлять данные в наше Клиентское приложение
*/
const express = require('express');
const router = express.Router();    // Создает новый объект маршрутизатора.

router.get('/api/hello', (req, res) => {
  res.json('hello world')
});

module.exports = router;