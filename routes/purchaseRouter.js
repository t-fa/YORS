/* This router implements the `Purchases` entity, pulling necessary data from the `Customers`
entity. This relationship is a 1:M relationship. */
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

    /* Get SELECT query for displaying all data in table (purchaseID, purchaseData, customerID, customer name)
      throught a join with Customers */
    let sql =
      'SELECT `purchaseID`, `purchaseDate`, `Purchases`.`customerID` AS "customerID",' +
      ' `Customers`.`customerFirstName` AS "customerFirstName", `Customers`.`customerLastName` AS "customerLastName"' +
      ' FROM `Purchases` LEFT JOIN `Customers` ON `Purchases`.`customerID`=`Customers`.`customerID`';
    let query = mysql.pool.query(sql, (err, results) => {
      if (err) {
        next(err);
        return;
      }

      context.purchases = results;

      // Get SELECT query for populating dropdown menu with customers for adding a new purchase
      let sql2 =
        'SELECT `customerID`, `customerFirstName`, `customerLastName` FROM `Customers` ORDER BY `customerID` ASC';
      mysql.pool.query(sql2, (err, results) => {
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
        // Post SQL INSERT query to add a new purchase
        'INSERT INTO `Purchases` (`purchaseDate`, `customerID`) VALUES (?,?)',
        [
          req.body.purchaseDate, 
          req.body.customerID
        ],
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
