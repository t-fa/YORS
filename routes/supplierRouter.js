const express = require('express'),
  bodyParser = require('body-parser'),
  mysql = require('../dbcon.js');

const supplierRouter = express.Router();
supplierRouter.use(bodyParser.urlencoded({ extended: false }));
supplierRouter.use(bodyParser.json());

supplierRouter
  .route('/')
  .get((req, res, next) => {
    let sql =
      'SELECT `supplierID`, `supplierName`, `supplierPlanet` FROM `Suppliers`';
    let query = mysql.pool.query(sql, (err, results) => {
      if (err) {
        next(err);
        return;
      }
      res.render('suppliers', { results: results });
    });
  })
  .post((req, res, next) => {
    if (req.body['addSupplier']) {
      mysql.pool.query(
        'INSERT INTO `Suppliers` (`supplierName`, `supplierPlanet`) VALUES (?,?)',
        [req.body.name, req.body.planet],
        (err) => {
          if (err) {
            next(err);
            return;
          }
        }
      );
    }
    res.redirect('suppliers');
  });

module.exports = supplierRouter;
