const express = require('express'),
  bodyParser = require('body-parser'),
  mysql = require('../dbcon.js');

const customerRouter = express.Router();
customerRouter.use(bodyParser.urlencoded({ extended: false }));
customerRouter.use(bodyParser.json());

customerRouter
  .route('/')
  .get((req, res, next) => {
    let sql =
      'SELECT `customerID`, `customerFirstName`, `customerLastName`, `customerPlanet` FROM `Customers`';
    let query = mysql.pool.query(sql, (err, results) => {
      if (err) {
        next(err);
        return;
      }
      res.render('customers', { results: results });
    });
  })
  .post((req, res, next) => {
    if (req.body['addCustomer']) {
      mysql.pool.query(
        'INSERT INTO `Customers` (`customerFirstName`, `customerLastName`, `customerPlanet`) VALUES (?,?,?)',
        [
          req.body.customerFirstName,
          req.body.customerLastName,
          req.body.customerPlanet,
        ],
        (err) => {
          if (err) {
            next(err);
            return;
          }
        }
      );
    }
  });

module.exports = customerRouter;
