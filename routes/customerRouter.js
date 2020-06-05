/* This router implements the `Customers` entity. */
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

    // display all customers
    let sql =
      'SELECT `customerID`, `customerFirstName`, `customerLastName`, `customerPlanet` FROM `Customers`';

    // filter customers by name or planet
    if (req.query.filterFirstName && req.query.filterLastName) {
      sql +=
        " WHERE `customerFirstName` LIKE '%" +
        req.query.filterFirstName +
        "%'" +
        " AND `customerLastName` LIKE '%" +
        req.query.filterLastName +
        "%'";
    } else if (req.query.filterFirstName) {
      sql +=
        " WHERE `customerFirstName` LIKE '%" + req.query.filterFirstName + "%'";
    } else if (req.query.filterLastName) {
      sql +=
        " WHERE `customerLastName` LIKE '%" + req.query.filterLastName + "%'";
    } else if (req.query.filterPlanet) {
      sql += " WHERE `customerPlanet` = '" + req.query.filterPlanet + "'";
    } else {
    }

    mysql.pool.query(sql, (err, result) => {
      if (err) {
        next(err);
        return;
      }

      context.customers = result;

      let sql2 =
        'SELECT DISTINCT `customerPlanet` FROM `Customers` ORDER BY `customerPlanet` ASC';
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
        // add new customer
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
