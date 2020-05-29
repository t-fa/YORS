const express = require('express'),
  bodyParser = require('body-parser'),
  mysql = require('../dbcon.js');

const orderRouter = express.Router();
orderRouter.use(bodyParser.urlencoded({ extended: false }));
orderRouter.use(bodyParser.json());

orderRouter
  .route('/')
  .get((req, res, next) => {
    let sql =
      'SELECT `orderID`, `customerID`, `orderDate`, `galacticPay`, `orderBeamed` FROM `Orders`';
    let query = mysql.pool.query(sql, (err, results) => {
      if (err) {
        next(err);
        return;
      }
      res.render('orders', { results: results });
    });
  })
  .post((req, res, next) => {
    if (req.body['addOrder']) {
      mysql.pool.query(
        'INSERT INTO `Orders` (`customerID`, `orderBeamed`, `orderDate`, `galacticPay`) VALUES (?,?,?,?)',
        [
          req.body.customerID,
          req.body.orderBeamed,
          req.body.orderDate,
          req.body.galaticPay,
        ],
        (err) => {
          if (err) {
            next(err);
            return;
          }
        }
      );
    }
    res.redirect('orders');
  });

module.exports = orderRouter;
