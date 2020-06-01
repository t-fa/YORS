const express = require('express'),
  bodyParser = require('body-parser'),
  mysql = require('../dbcon.js');

const customerRouter = express.Router();
customerRouter.use(bodyParser.urlencoded({ extended: false }));
customerRouter.use(bodyParser.json());

customerRouter
  .route('/')
  .get((req, res, next) => {
    let context = {};

    let sql =
      'SELECT `customerID`, `customerFirstName`, `customerLastName`, `customerPlanet` FROM `Customers`';

    if (req.query.filterFirstName && req.query.filterLastName) {
      sql +=
        " WHERE `customerFirstName` = '" +
        req.query.filterFirstName +
        "'" +
        " AND `customerLastName` = '" +
        req.query.filterLastName +
        "'";
    }
    if (req.query.filterPlanet) {
      sql += " WHERE `customerPlanet` = '" + req.query.filterPlanet + "'";
    }

    mysql.pool.query(sql, (err, result) => {
      if (err) {
        next(err);
        return;
      }

      context.customers = result;

      let sql2 = 'SELECT DISTINCT `customerPlanet` FROM `Customers`';
      mysql.pool.query(sql2, (err, result) => {
        if (err) {
          next(err);
          return;
        }

        context.planets = result;

        res.render('customers', context);
      });
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
    res.redirect('customers');
  });

module.exports = customerRouter;
