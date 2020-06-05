/* This router implements the `Items` entity, pulling necessary data from the `Suppliers`
entity. This relationship is a 1:M relationship. */
const express = require('express'),
  bodyParser = require('body-parser'),
  mysql = require('../dbcon.js');

const itemRouter = express.Router();
itemRouter.use(bodyParser.urlencoded({ extended: false }));
itemRouter.use(bodyParser.json());

// index page for /items
itemRouter
  .route('/')
  .get((req, res, next) => {
    let context = {};

    // this query populates the table seen on the /items page
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

      // this query is used to display the list of potential suppliers in the INSERT dropdown
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
          // this is the INSERT query for items if supplier ID is known
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
          // this is the INSERT query for items if supplier ID is unknown
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

    // this query is used to populate the input fields for a specific item on a GET request as
    // seen on the editItem page
    let sql =
      'SELECT `itemID`, `itemType`, `YeOldePrice`, `currentQuantity`, `Items`.`supplierID` AS "supplierID",' +
      ' `Suppliers`.`supplierName` AS "supplierName"  FROM `Items` LEFT JOIN `Suppliers` ON' +
      ' `Items`.`supplierID` = `Suppliers`.`supplierID` WHERE `itemID` = ' +
      req.params.itemId;

    mysql.pool.query(sql, (err, result) => {
      if (err) {
        next(err);
        return;
      }

      context.item = result;

      /* dynamically populated list for the edit for the suppliers.  If it's null, then it will 
      get all the suppliers names and ids.  If it's not null, then it will get all other suppler 
      names and ids aside from the one that will be selected. */
      let sql2 =
        'SELECT `supplierID` AS "sid", `supplierName` AS "sname" FROM `Suppliers` WHERE NOT EXISTS' +
        ' (SELECT `Items`.`supplierID` FROM `Items` LEFT JOIN `Suppliers` ON `Items`.`supplierID` = `Suppliers`.`supplierID`' +
        ' WHERE `itemID` = ' +
        req.params.itemId +
        ' AND `Suppliers`.`supplierID` = `Items`.`supplierID`) OR supplierID' +
        ' NOT IN (SELECT `Items`.`supplierID` FROM `Items` LEFT JOIN `Suppliers` ON' +
        ' `Items`.`supplierID` = `Suppliers`.`supplierID` WHERE itemID = ' +
        req.params.itemId +
        ')';

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
  .post((req, res, next) => {
    if (req.body['updateItem']) {
      console.log(req.body);
      console.log(req.params.itemId);
      // this is used to UPDATE a specific item
      let sql =
        'UPDATE `Items` SET `itemType`=?, `supplierID`=?, `YeOldePrice`=?, `currentQuantity`=? WHERE `itemID`=?';
      let updateValues = [
        req.body.itemType,
        req.body.s_id,
        req.body.price,
        req.body.quantity,
        req.params.itemId,
      ];
      mysql.pool.query(sql, updateValues, (err) => {
        if (err) {
          next(err);
          return;
        }
      });
    }
    res.redirect('../../items');
  });

itemRouter.route('/delete/:itemId').get((req, res) => {
  // used to DELETE a specific item
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
