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
    
    //Get SELECT query for table
    let sql =
      'SELECT `Orders`.`orderID` AS "orderID", `orderDate`, `galacticPay`, `orderBeamed`, `Orders`.`customerID` AS "customerID",\
       `Customers`.`customerFirstName` AS "customerFirstName", `Customers`.`customerLastName` AS "customerLastName",\
       `OrderItem`.`itemID` AS "itemID", `OrderItem`.`quantity` AS "quantity", `Items`.`itemType` AS "itemType" FROM `Orders`\
       LEFT JOIN `Customers` ON `Orders`.`customerID` = `Customers`.`customerID`\
       LEFT JOIN `OrderItem` ON `Orders`.`orderID` = `OrderItem`.`orderID`\
       LEFT JOIN `Items` ON `OrderItem`.`itemID` = `Items`.`itemID`';
    let query = mysql.pool.query(sql, (err, results) => {
      if (err) {
        next(err);
        return;
      }

      context.orders = results;

      //Get SELECT query for item type for dynamically populated drop down menu
      let sql2 = 'SELECT `itemID`, `itemType` FROM `Items`';
      let query2 = mysql.pool.query(sql2, (err, results) => {
        if (err) {
          next(err);
          return;
        }
  
        context.items = results;

        //Get SELECT query for customer name for dynamically populated drop down menu
        let sql3 = 'SELECT `customerID`, `customerFirstName`, `customerLastName` FROM `Customers`';
        let query3 = mysql.pool.query(sql3, (err, results) => {
          if (err) {
            next(err);
            return;
          }

          context.customers = results;

          //Get SELECT query for order ID for dynamically populated drop down menu
          let sql4 = 'SELECT `orderID` FROM `Orders`';
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
    if (req.body['addOrder']) {  
      mysql.pool.getConnection( (err, conn) => {
        conn.beginTransaction( (err) => {
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
                    req.body.galaticPay,
                ],
                (err, result) => {
                if (err) { 
                    conn.rollback( () => {
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
                        conn.rollback( () => {
                            next(err);
                            return;
                        });
                    }
        
                    conn.commit( (err) => {
                        if (err) { 
                            conn.rollback( () => {
                                next(err);
                                return;
                            });
                        }
                    });
                });
            });
        });
      }); 
    }

    if (req.body['addItemToOrder']) {
      mysql.pool.query(
        'INSERT INTO `OrderItem` (`orderID`, `itemID`, `quantity`) VALUES (?,?,?)',
        [
            req.body.orderID, 
            req.body.itemID, 
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

    //if (req.body[''])
    res.redirect('orders');
  });

module.exports = orderRouter;
