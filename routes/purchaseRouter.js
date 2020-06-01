const express = require('express'),
  bodyParser = require('body-parser'),
  mysql = require('../dbcon.js');

const purchaseRouter = express.Router();
purchaseRouter.use(bodyParser.urlencoded({ extended: false }));
purchaseRouter.use(bodyParser.json());

purchaseRouter
  .route('/')
  .get((req, res, next) => {
    let context = {};

    let sql =
      'SELECT `purchaseID`, `purchaseDate`, `Purchases`.`customerID` AS "customerID", `Customers`.`customerFirstName` AS "customerFirstName", `Customers`.`customerLastName` AS "customerLastName" FROM `Purchases` LEFT JOIN `Customers` ON `Purchases`.`customerID`=`Customers`.`customerID`';
    let query = mysql.pool.query(sql, (err, results) => {
      if (err) {
        next(err);
        return;
      }

      context.purchases = results;

      let sql2 = 'SELECT `customerID`, `customerFirstName`, `customerLastName` FROM `Customers`';
      mysql.pool.query(sql2, (err,results) => {
        if (err) {
          next(err);
          return;
        }

        context.customers = results;
        res.render('purchases', context);
      });  
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
    res.redirect('purchases');
  });

module.exports = purchaseRouter;