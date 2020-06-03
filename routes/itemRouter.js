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
      'SELECT `itemID`, `itemType`, `YeOldePrice`, `currentQuantity`, `Items`.`supplierID` AS "supplierID",' +
      ' `Suppliers`.`supplierName` AS "supplierName"  FROM `Items` LEFT JOIN `Suppliers` ON' +
      ' `Items`.`supplierID` = `Suppliers`.`supplierID`';
    let query = mysql.pool.query(sql, (err, results) => {
      if (err) {
        next(err);
        return;
      }

      context.items = results;

      let sql2 = 'SELECT `supplierID`, `supplierName` FROM `Suppliers`';
      mysql.pool.query(sql2, (err, results) => {
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
      } else {
        console.log(req.body.s_id);
        mysql.pool.query(
          'INSERT INTO `Items` (`itemType`, `supplierID`, `YeOldePrice`, `currentQuantity`) VALUES (?,?,?,?)',
          [req.body.item, req.body.s_id, req.body.price, req.body.quantity],
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

itemRouter
  .route('/:itemId')
  .get((req, res, next) => {
    let context = {};

    let sql =
    'SELECT `itemID`, `itemType`, `YeOldePrice`, `currentQuantity`, `Items`.`supplierID` AS "supplierID",' +
    ' `Suppliers`.`supplierName` AS "supplierName"  FROM `Items` LEFT JOIN `Suppliers` ON' +
    ' `Items`.`supplierID` = `Suppliers`.`supplierID` WHERE `itemID` = ' + req.params.itemId;

    mysql.pool.query(sql, (err, result) => {
      if (err) {
        next(err);
        return;
      }

      context.item = result;

      let sql2 = 'SELECT `supplierID` AS "sid", `supplierName` AS "sname" FROM `Suppliers` WHERE NOT EXISTS' +
      ' (SELECT `Items`.`supplierID` FROM `Items` LEFT JOIN `Suppliers` ON `Items`.`supplierID` = `Suppliers`.`supplierID`' +
      ' WHERE `itemID` = ' + req.params.itemId + ' AND `Suppliers`.`supplierID` = `Items`.`supplierID`) OR supplierID' +
      ' NOT IN (SELECT `Items`.`supplierID` FROM `Items` LEFT JOIN `Suppliers` ON' +
      ' `Items`.`supplierID` = `Suppliers`.`supplierID` WHERE itemID = ' + req.params.itemId + ')';

      console.log(sql2);

      mysql.pool.query(sql2, (err, result) => {
        if (err) {
          next(err);
          return;
        }

        context.suppliers = result;
        console.log(context);
        res.render('editItem', context);
      });
    });
  })
  .post((req, res) => {
    mysql.pool.query(
      `UPDATE \`Items\` SET \`itemType\` = ${req.body.itemType}, 
      \`supplierID\` = ${req.body.s_id}, \`YeOldePrice\` =  ${req.body.price}, 
      \`currentQuantity\` = ${req.body.quantity} 
      WHERE itemID = ${req.params.itemId}`,
      (err) => {
        if (err) {
          next(err);
          return;
        }
      }
    );
    res.redirect('items');
  });
    /* Does not work, says syntax error at req.body
    .put('/:editId', (req, res) => {
    mysql.pool.query(
      'UPDATE `Items` SET `itemType` = ?, `supplierID` = ?, `YeOldePrice` = ?, `currentQuantity` = ? WHERE `itemID` = ?', 
      [
        req.body.itemType,
        req.body.s_id,
        req.body.price,
        req.body.quantity,
        req.params.itemId
      ]
      (err) => {
        if (err) {
          next(err);
          return;
        }
      }
    );
    res.redirect('items');
  }); */

itemRouter.route('/delete/:itemId').get((req, res) => {
  let sql = 'DELETE FROM `Items` WHERE itemID = ' + req.params.itemId;
  mysql.pool.query(sql, (err) => {
    if (err) {
      next(err);
      return;
    }
    res.redirect('../../items');
  });
});

module.exports = itemRouter;