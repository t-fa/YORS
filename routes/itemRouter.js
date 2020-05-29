const express = require('express'),
  bodyParser = require('body-parser'),
  mysql = require('../dbcon.js');

const itemRouter = express.Router();
itemRouter.use(bodyParser.urlencoded({ extended: false }));
itemRouter.use(bodyParser.json());

itemRouter
  .route('/')
  .get((req, res, next) => {
    let sql =
      'SELECT `itemID`, `itemType`, `supplierID`, `YeOldePrice`, `currentQuantity` FROM `Items`';
    let query = mysql.pool.query(sql, (err, results) => {
      if (err) {
        next(err);
        return;
      }
      res.render('items', { results: results });
    });
  })
  .post((req, res, next) => {
    if (req.body['addItem']) {
      if (req.body.s_id === 'NULL') {
        mysql.pool.query(
          'INSERT INTO `Items` (`itemType`, `YeOldePrice`, `currentQuantity`) VALUES (?,?,?)',
          [req.body.item, req.body.price, req.body.quantity],
          (err) => {
            if (err) {
              next(err);
              return;
            } else {
              mysql.pool.query(
                'INSERT INTO `Items` (`itemType`, `supplierID`, `YeOldePrice`, `currentQuantity`) VALUES (?,?,?,?)',
                [
                  req.body.item,
                  req.body.s_id,
                  req.body.price,
                  req.body.quantity,
                ],
                (err) => {
                  if (err) {
                    next(err);
                    return;
                  }
                }
              );
            }
          }
        );
      }
    }
  });

module.exports = itemRouter;
