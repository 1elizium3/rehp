-- Создаю таблицы
-- Таблица пользователей
CREATE TABLE users (
  uid SERIAL PRIMARY KEY,   --ПЕРВИЧНЫЙ КЛЮЧ: уникальный номер, сгенерированный psql для заданного столбца.
  username VARCHAR(255) UNIQUE, -- УНИКАЛЬНО : предотвращает дублирование записей в столбце
  email VARCHAR(255),   --VARCHAR (255): переменный символ или текст и числа. 255 устанавливает длину строки.
  email_verified BOOLEAN, --BOOLEAN : верно или неверно
  date_created DATE,
  last_login DATE
);
--Таблица сообщений
CREATE TABLE posts (
  pid SERIAL PRIMARY KEY,
  title VARCHAR(255),
  body VARCHAR,
  user_id INT REFERENCES users(uid), --ССЫЛКИ: как установить внешний ключ. Внешний ключ - это первичный ключ в другой таблице
  author VARCHAR REFERENCES users(username),
  date_created TIMESTAMP,
  like_user_id INT[] DEFAULT ARRAY[]::INT[], --Сначала у нас есть массив целых чисел, затем мы устанавливаем для этого 
            --целочисленного массива значение по умолчанию пустого массива типа массив целых чисел.
  likes INT DEFAULT 0
);
--Таблица комментариев
CREATE TABLE comments (
  cid SERIAL PRIMARY KEY,
  comment VARCHAR(255),
  author VARCHAR REFERENCES users(username),
  user_id INT REFERENCES users(uid),
  post_id INT REFERENCES posts(pid),
  date_created TIMESTAMP
);

-- column_name data_type REFERENCES other_table(column_name_in_other_table);