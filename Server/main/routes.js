/*
  Файл содержит все express маршруты,
    которые позволит отправлять данные в наше Клиентское приложение
*/
const express = require('express');
const router = express.Router();    // Создает новый объект маршрутизатора.
const pool = require('./db');

// МАРШРУТЫ СООБЩЕНИЙ
// Извлекает все сообщения из БД
// pool.query позволяет делать SQL-запросы к базе данных в строковом формате
router.get('/api/get/allposts', (req, res) => {
  //ORDER BY date_created DESC позволяет отображать самые свежие сообщения первыми.
  pool.query(`SELECT * FROM posts ORDER BY date_created DESC`, 
              (query_res ,query_err) => {
                res.json(query_res.row);
              });
});
// Чтение поста
router.get('/api/get/post', (req, res) => {
  const post_id = req.query.post_id;

  pool.query(`SELECT * FROM posts WHERE pid=$1`, [post_id],
              (query_res, query_err) => {
                res.json(query_res.rows);
              });
});
// Сохраняю сообщение пользователя в БД.
// next: это промежуточное ПО, которое позволяет передавать обратные вызовы следующей функции.
router.get('/api/post/posttodb', (req, res, next) => {
  const values = [ req.body.title, 
                  req.body.body,
                  req.body.uid, 
                  req.body.username ];
  // Добавляю значения в сообщения
  // $1- первый элемент в массиве и тд.
  pool.query(`INSERT INTO posts(title, body, user_id, author, date_created)
              VALUES($1, $2, $3, $4, NOW() )`, values, 
                (query_res, query_err) => {
                  if (query_err) {
                    return next(query_err);
                  }
                  res.json(query_res.rows);
                });
});
// Редактирую существующее сообщение в БД
router.put('/api/put/post', (req, res, next) => {
  const values = [ req.body.title,
                   req.body.body, 
                   req.body.uid, 
                   req.body.pid, 
                   req.body.username ];
  pool.query(`UPDATE posts SET title= $1, body=$2, user_id=$3, author=$5, date_created=NOW()
              WHERE pid = $4`, values,
              (query_err, query_res) => {
                console.log(query_res);
                console.log(query_err);
        });
});
// Удаляю все комментарии, связанные с сообщением
router.delete('/api/delete/postcomments', (req, res, next) => {
  const post_id = req.body.post_id;
  pool.query(`DELETE FROM comments WHERE post_id = $1`, [ post_id ],
              (query_err, query_res) => {
                  res.json(query_res.rows);
                  console.log(query_err);
        });
});
// Удаляю сообщение с идентификатором сообщения
router.delete('/api/delete/post', (req, res, next) => {
  const post_id = req.body.post_id
  pool.query(`DELETE FROM posts WHERE pid = $1`, [ post_id ],
              (query_err, query_res) => {
                res.json(query_res.rows);
                console.log(query_err);
       });
});
// Делаю запрос на добавление, чтобы добавить идентификатор пользователя, которому 
// понравился пост, в like_user_id массив, затем увеличиваю likes счетчик на 1
router.put('/api/put/likes', (req, res, next) => {
  const uid = [ req.body.uid ];
  const post_id = String(req.body.post_id);
  const values = [ uid, post_id ];
  console.log(values);

  pool.query(`UPDATE posts
              SET like_user_id = like_user_id || $1, likes = likes + 1
              WHERE NOT (like_user_id @> $1)
              AND pid = ($2)`,
     values, (query_err, query_res) => {
    if (query_err) return next(query_err);
    console.log(query_res)
    res.json(query_res.rows);
  });
});

// РАЗДЕЛ МАРШРУТОВ КОММЕНТИРОВАНИЯ
// Сохраняю комментарий к БД
router.post('/api/post/commenttodb', (req, res, next) => {
  const values = [ req.body.comment, 
                  req.body.user_id, 
                  req.body.username, 
                  req.body.post_id ];
  // Добавляю значение в коментарий
  pool.query(`INSERT INTO comments(comment, user_id, author, post_id, date_created)
              VALUES($1, $2, $3, $4, NOW())`, values,
              (query_err, query_res ) => {
                  res.json(query_res.rows);
                  console.log(query_err);
      });
});
// Редактирую существующий комментарий в БД
router.put('/api/put/commenttodb', (req, res, next) => {
  const values = [ req.body.comment,
                   req.body.user_id, 
                   req.body.post_id, 
                   req.body.username, 
                   req.body.cid ];

  pool.query(`UPDATE comments SET comment = $1, user_id = $2, post_id = $3, author = $4, date_created=NOW()
              WHERE cid=$5`, values,
              (query_err, query_res ) => {
                  res.json(query_res.rows)
                  console.log(query_err)
      });
});
// Удаляю один коментарий
router.delete('/api/delete/comment', (req, res, next) => {
  const cid = req.body.comment_id;
  console.log(cid);

  pool.query(`DELETE FROM comments
              WHERE cid=$1`, [ cid ],
              (query_err, query_res ) => {
                  res.json(query_res);
                  console.log(query_err);
      });
});
// Извлекаю все комментарии, связанные с одним сообщением
router.get('/api/get/allpostcomments', (req, res, next) => {
  const post_id = String(req.query.post_id);
  pool.query(`SELECT * FROM comments
              WHERE post_id=$1`, [ post_id ],
              (query_err, query_res ) => {
                  res.json(query_res.rows);
      });
});

// ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ
// Сохраняю данные профиля пользователя из auth0 в собственную базу данных. 
//  Если пользователь уже существует, PostgreSQL ничего не делает
router.post('/api/posts/userprofiletodb', (req, res, next) => {
  const values = [ req.body.profile.nickname, 
                  req.body.profile.email, 
                  req.body.profile.email_verified ];
  // Добавляю значения для пользователя
  pool.query(`INSERT INTO users(username, email, email_verified, date_created)
              VALUES($1, $2, $3, NOW())
              ON CONFLICT DO NOTHING`, values,
              (query_err, query_res) => {
                res.json(query_res.rows);
      });
});
// Извлекаю пользователя, просматривая его электронную почту
router.get('/api/get/userprofilefromdb', (req, res, next) => {
  const email = req.query.email
  console.log(email)
  pool.query(`SELECT * FROM users
              WHERE email=$1`, [ email ],
              (query_err, query_res) => {
                res.json(query_res.rows);
      });
});
// Извлекаю сообщения, сделанные пользователем, просматривая все сообщения, 
//  соответствующие их идентификатору пользователя
router.get('/api/get/userposts', (req, res, next) => {
  const user_id = req.query.user_id
  console.log(user_id)
  pool.query(`SELECT * FROM posts
              WHERE user_id=$1`, [ user_id ],
              (query_err, query_res) => {
                res.json(query_res.rows);
      });
});

// Получить профиль другого пользователя из db на основе имени пользователя 
router.get('/api/get/otheruserprofilefromdb', (req, res, next) => {
  // const email = [ "%" + req.query.email + "%"]
  const username = String(req.query.username)
  pool.query(`SELECT * FROM users
              WHERE username = $1`,
    [ username ], (query_err, query_res) => {
    res.json(query_res.rows);
  });
});

// Получить сообщения другого пользователя на основе имени пользователя
router.get('/api/get/otheruserposts', (req, res, next) => {
  const username = String(req.query.username)
  pool.query(`SELECT * FROM posts
              WHERE author = $1`,
    [ username ], (query_err, query_res) => {
    res.json(query_res.rows);
  });
});

router.get('/api/hello', (req, res) => {
  res.json('Server hello world')
});

module.exports = router;