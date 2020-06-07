/* This router implements the `Items` entity, pulling necessary data from the `Suppliers`
entity. This relationship is a 1:M relationship. */
const express = require('express'),
  bodyParser = require('body-parser'),
  mysql = require('../dbcon.js');

const itemRouter = express.Router();
itemRouter.use(bodyParser.urlencoded({ extended: false }));
itemRouter.use(bodyParser.json());

// Index page for /items
itemRouter
  .route('/')
  .get((req, res, next) => {
    let context = {};

    /* Get SELECT query for table on /items page (itemID, item description, price, quantity, supplier name and id)
       through a join with the Suppliers Entity  */
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

      /* Get SELECT query for populating dropdown menu with suppliers for adding a new item */
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
          // Post SQL INSERT query to add a new item if supplier ID selected is NULL
          'INSERT INTO `Items` (`itemType`, `YeOldePrice`, `currentQuantity`) VALUES (?,?,?)',
          [
            req.body.item, 
            req.body.price, 
            req.body.quantity
          ],
          (err) => {
            if (err) {
              next(err);
              return;
            }
          }
        );
      } else {
        mysql.pool.query(
          // Post SQL INSERT query to add a new item if supplier ID selected is NOT NULL
          'INSERT INTO `Items` (`itemType`, `supplierID`, `YeOldePrice`, `currentQuantity`) VALUES (?,?,?,?)',
          [
            req.body.item, 
            req.body.s_id, 
            req.body.price, 
            req.body.quantity
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

  // Index page for /items/:itemId update page
itemRouter
  .route('/:itemId')
  .get((req, res, next) => {
    let context = {};

    /* Get SQL SELECT query is used to populate the input fields for the selected item displayed on the 
       editItem page */
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

      /* Get SQL SELECT query for populating dropdown menu with the suppliers for the edit an item
         page.  The query is set up so that it will select the supplier options excluding the 
         current supplier.  If the current supplier is null, then the query will get all the supplier
         names and ids.  If it is not null, then it will get all other supplier name and ids aside
         from the current one that will be selected in the drop down menu.  This will prevent having
         duplicate options in the dropdown menu. */
      let sql2 =
        'SELECT `supplierID` AS "sid", `supplierName` AS "sname" FROM `Suppliers` WHERE NOT EXISTS' +
        ' (SELECT `Items`.`supplierID` FROM `Items` LEFT JOIN `Suppliers` ON' +
        ' `Items`.`supplierID` = `Suppliers`.`supplierID`' +
        ' WHERE `itemID` = ' +
        req.params.itemId +
        ' AND `Suppliers`.`supplierID` = `Items`.`supplierID`) OR `supplierID`' +
        ' NOT IN (SELECT `Items`.`supplierID` FROM `Items` LEFT JOIN `Suppliers` ON' +
        ' `Items`.`supplierID` = `Suppliers`.`supplierID` WHERE `itemID` = ' +
        req.params.itemId +
        ')';

      mysql.pool.query(sql2, (err, result) => {
        if (err) {
          next(err);
          return;
        }

        context.suppliers = result;
        res.render('editItem', context);
      });
    });
  })
  .post((req, res, next) => {
    if (req.body['updateItem']) {
      // Post SQL UPDATE query to update a specific item if supplierID has been updated to NULL
      if (req.body.s_id === 'NULL') {
        let sql =
        'UPDATE `Items` SET `itemType`=?, `supplierID`= NULL, `YeOldePrice`=?, `currentQuantity`=? WHERE `itemID`=?';
        let updateValues = [
          req.body.itemType,
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
      else {
        let sql =
        'UPDATE `Items` SET `itemType`=?, `supplierID`= ?, `YeOldePrice`=?, `currentQuantity`=? WHERE `itemID`=?';
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
    }
    res.redirect('../../items');
  });

itemRouter.route('/delete/:itemId').get((req, res) => {
  // Get SQL DELETE query to delete a specific item
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
