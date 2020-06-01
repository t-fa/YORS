const express = require('express'),
  bodyParser = require('body-parser'),
  mysql = require('../dbcon.js');

const itemRouter = express.Router();
itemRouter.use(bodyParser.urlencoded({ extended: false }));
itemRouter.use(bodyParser.json());

itemRouter
  .route('/')
  .get((req, res, next) => {
    let context = {};

    let sql =
      'SELECT `itemID`, `itemType`, `YeOldePrice`, `currentQuantity`, `Items`.`supplierID` AS "supplierID", `Suppliers`.`supplierName` AS "supplierName"  FROM `Items` LEFT JOIN `Suppliers` ON `Items`.`supplierID` = `Suppliers`.`supplierID`';
    let query = mysql.pool.query(sql, (err, results) => {
      if (err) {
        next(err);
        return;
      }

      context.items = results;

      let sql2 = 'SELECT `supplierID`, `supplierName` FROM `Suppliers`';
      mysql.pool.query(sql2, (err,results) => {
        if (err) {
          next(err);
          return;
        }

        context.suppliers = results;
        res.render('items', context);
      });
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
            } 
          }
        );
      }
      else {
        console.log(req.body.s_id);
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
    res.redirect('items');
  });

module.exports = itemRouter;