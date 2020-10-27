// Подключаю БД к серверу
const { Pool } = require('pg');
/*
  pg: Это основная библиотека, для связи с базой данных psql. 
  Без этой библиотеки связь с базой данных будет невозможна.
*/

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '0000',
  post: 5432
});

module.exports = pool;