
/*
created: 18:11 11-Sep-2021
closed:  20:33 11-Sep-2021
author:  iluvgirlswithglasses
*/

const express = require('express');
const app = express();
const port = 3000;
const sqlite3 = require('sqlite3').verbose();

app.use(express.static('public'));
app.use(express.json({
  type: 'application/json',
}));

let db = new sqlite3.Database('logs.sqlite3');


/**
 * gets
 * */
app.get('/timestamp', (req, res) => {
  res.send({
    'timestamp': new Date().getTime(),
  });
});

app.get('/logs', (req, res) => {
  let lim = req.query.limit;
  if (lim == null) lim = 10;
  try {
    db.serialize(() => {
      //
      db.all(`select timestamp, level, message from log order by id desc limit ${lim};`, (err, row) => {
        res.send(row);
      });
      //
    });
  } catch (e) {}
});


/**
 * posts
 * */
app.post('/logs', (req, res) => {
  try {
    db.serialize(() => {
      let state = db.prepare('insert into log (level, message, timestamp) values (?, ?, ?)');
      state.run(req.body.level, req.body.message, `${new Date().getTime()}`);
    });
  } catch (e) {}
});


/**
 * listeners
 * */
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
