/* This router implements the `Orders` entity, pulling necessary data from the `Customers`,
`Items` and `OrderItem` entities. Customers:Orders is a 1:M relationship. `OrderItem`
implements the M:M relationship between `Items` and `Orders`. */
const express = require('express'),
  bodyParser = require('body-parser'),
  mysql = require('../dbcon.js');

const orderRouter = express.Router();
orderRouter.use(bodyParser.urlencoded({ extended: false }));
orderRouter.use(bodyParser.json());

orderRouter
  .route('/')
  .get((req, res, next) => {
    let context = {};

    /* Get SELECT query for table (orderID, customer name (id), date of order, item name, quanity, galaticPay, order beamed)
       through a join with Orders, Customers, and Items Entity and the OrderItem intersection table */
    let sql =
      'SELECT `Orders`.`orderID` AS "orderID", `orderDate`, `galacticPay`, `orderBeamed`, `Orders`.`customerID` AS "customerID",' +
      ' `Customers`.`customerFirstName` AS "customerFirstName", `Customers`.`customerLastName` AS "customerLastName",' +
      ' `OrderItem`.`itemID` AS "itemID", `OrderItem`.`quantity` AS "quantity", `Items`.`itemType` AS "itemType" FROM `Orders`' +
      ' LEFT JOIN `Customers` ON `Orders`.`customerID` = `Customers`.`customerID`' +
      ' LEFT JOIN `OrderItem` ON `Orders`.`orderID` = `OrderItem`.`orderID`' +
      ' LEFT JOIN `Items` ON `OrderItem`.`itemID` = `Items`.`itemID`';
    let query = mysql.pool.query(sql, (err, results) => {
      if (err) {
        next(err);
        return;
      }

      context.orders = results;

      /* Get SELECT query for populating dropdown menu with item descriptions for adding a new order
        and a new item to an order */
      let sql2 =
        'SELECT `itemID`, `itemType` FROM `Items` ORDER BY `itemID` ASC';
      let query2 = mysql.pool.query(sql2, (err, results) => {
        if (err) {
          next(err);
          return;
        }

        context.items = results;

        // Get SELECT query for populating dropdown menu with customers for adding a new order
        let sql3 =
          'SELECT `customerID`, `customerFirstName`, `customerLastName` FROM `Customers` ORDER BY `customerID` ASC';
        let query3 = mysql.pool.query(sql3, (err, results) => {
          if (err) {
            next(err);
            return;
          }

          context.customers = results;

          //Get SELECT query for populating dropdown menu with order IDs for adding a new item to an order 
          let sql4 = 'SELECT `orderID` FROM `Orders` ORDER BY `orderID` ASC';
          let query4 = mysql.pool.query(sql4, (err, results) => {
            if (err) {
              next(err);
              return;
            }

            context.oIDs = results;
            res.render('orders', context);
          });
        });
      });
    });
  })
  .post((req, res, next) => {
    /* If the user adds an order, it will use a transaction SQL query that will first add an entry into the 
       Orders Entity and then add the corresponding OrderItem entry (the entries will only be added if both
       entrires are able to be added) */
    if (req.body['addOrder']) {
      mysql.pool.getConnection((err, conn) => {
        conn.beginTransaction((err) => {
          if (err) {
            next(err);
            return;
          }
          conn.query(
            'INSERT INTO `Orders` (`customerID`, `orderBeamed`, `orderDate`, `galacticPay`) VALUES (?,?,?,?)',
            [
              req.body.customerID,
              req.body.orderBeamed,
              req.body.orderDate,
              req.body.galacticPay,
            ],
            (err, result) => {
              if (err) {
                conn.rollback(() => {
                  next(err);
                  return;
                });
              }

              let log = result.insertId;

              conn.query(
                'INSERT INTO `OrderItem` (`orderID`, `itemID`, `quantity`) VALUES (?,?,?)',
                [
                  log, 
                  req.body.itemID, 
                  req.body.quantity
                ],
                (err, result) => {
                  if (err) {
                    conn.rollback(() => {
                      next(err);
                      return;
                    });
                  }

                  conn.commit((err) => {
                    if (err) {
                      conn.rollback(() => {
                        next(err);
                        return;
                      });
                    }
                  });
                }
              );
            }
          );
        });
      });
    }

    /* If the user adds an item to the order, it will add in a new entry if the unique 
       orderID, itemID is not already in the database.  If it is in the database, then
       the quantity entered by the user will be added to the current quantity */
    if (req.body['addItemToOrder']) {
      mysql.pool.query(
        'INSERT INTO `OrderItem` (`orderID`, `itemID`, `quantity`) VALUES (?,?,?)' +
        ' ON DUPLICATE KEY UPDATE `quantity` = `quantity` + ?',
        [
          req.body.orderID, 
          req.body.itemID, 
          req.body.quantity,
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
    res.redirect('orders');
  });

orderRouter.route('/delete/:orderId/:itemId').get((req, res) => {
  // Get SQL DELETE query to delete a specific item from a specific order
  let sql =
    'DELETE FROM `OrderItem` WHERE `orderID` = ' +
    req.params.orderId +
    ' AND `itemID` = ' +
    req.params.itemId;

  mysql.pool.query(sql, (err) => {
    if (err) {
      next(err);
      return;
    }
    res.redirect('../../../../orders');
  });
});

module.exports = orderRouter;