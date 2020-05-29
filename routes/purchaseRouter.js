const express = require('express'),
  bodyParser = require('body-parser'),
  mysql = require('../dbcon.js');

const purchaseRouter = express.Router();
orderRouter.use(bodyParser.urlencoded({ extended: false }));
orderRouter.use(bodyParser.json());

purchaseRouter
  .route('/')
  .get((req, res, next) => {
    let sql =
      'SELECT `purchaseID`, `purchaseDate`, `customerID` FROM `Purchases`';
    let query = mysql.pool.query(sql, (err, results) => {
      if (err) {
        next(err);
        return;
      }
      res.render('purchases', { results: results });
    });
  })
  .post((req, res, next) => {
    if (req.body['addPurchase']) {
      mysql.pool.query(
        'INSERT INTO `Purchases` (`purchaseDate`, `customerID`) VALUES (?,?)',
        [req.body.purchaseDate, req.body.customerID],
        (err) => {
          if (err) {
            next(err);
            return;
          }
        }
      );
    }
  });

module.exports = purchaseRouter;
