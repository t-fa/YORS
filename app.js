const express = require('express'),
  mysql = require('./dbcon.js'), // Storing credentials in another file
  app = express(),
  handlebars = require('express-handlebars'),
  path = require('path'),
  bodyParser = require('body-parser'),
  orderRouter = require('./routes/orderRouter'),
  customerRouter = require('./routes/customerRouter');

app.use(express.static(path.join(__dirname, 'public')));

app.engine(
  'handlebars',
  handlebars({
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/',
  })
);
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Index Page
app.get('/', (req, res) => res.render('index'));

//Customers
app.use('/customers', customerRouter);

//Orders
app.use('/orders', orderRouter);

//Edit Orders
app.get('/editOrder', (req, res) => res.render('editOrder'));

//Items
app.get('/items', (req, res, next) => {
  let sql =
    'SELECT `itemID`, `itemType`, `supplierID`, `YeOldePrice`, `currentQuantity` FROM `Items`';
  let query = mysql.pool.query(sql, (err, results) => {
    if (err) {
      next(err);
      return;
    }
    res.render('items', { results: results });
  });
});

// Add a new Item
app.post('/items', (req, res, next) => {
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

          let sql =
            'SELECT `itemID`, `itemType`, `supplierID`, `YeOldePrice`, `currentQuantity` FROM `Items`';
          let query = mysql.pool.query(sql, (err, results) => {
            if (err) {
              next(err);
              return;
            }
            res.render('items', { results: results });
          });
        }
      );
    } else {
      mysql.pool.query(
        'INSERT INTO `Items` (`itemType`, `supplierID`, `YeOldePrice`, `currentQuantity`) VALUES (?,?,?,?)',
        [req.body.item, req.body.s_id, req.body.price, req.body.quantity],
        (err) => {
          if (err) {
            next(err);
            return;
          }

          let sql =
            'SELECT `itemID`, `itemType`, `supplierID`, `YeOldePrice`, `currentQuantity` FROM `Items`';
          let query = mysql.pool.query(sql, (err, results) => {
            if (err) {
              next(err);
              return;
            }
            res.render('items', { results: results });
          });
        }
      );
    }
  }
});

//OrderItem
app.get('/orderItem', (req, res, next) => {
  let sql = 'SELECT `orderID`, `itemID`, `quantity` FROM `OrderItem`';
  let query = mysql.pool.query(sql, (err, results) => {
    if (err) {
      next(err);
      return;
    }
    res.render('orderItem', { results: results });
  });
});

// Add a new item to an order
app.post('/orderItem', (req, res, next) => {
  if (req.body['addItemToOrder']) {
    mysql.pool.query(
      'INSERT INTO `OrderItem` (`orderID`, `itemID`, `quantity`) VALUES (?,?,?)',
      [req.body.orderID, req.body.itemID, req.body.quantity],
      (err) => {
        if (err) {
          next(err);
          return;
        }

        let sql = 'SELECT `orderID`, `itemID`, `quantity` FROM `OrderItem`';
        let query = mysql.pool.query(sql, (err, results) => {
          if (err) {
            next(err);
            return;
          }
          res.render('orderItem', { results: results });
        });
      }
    );
  }
});

//Purchases
app.get('/purchases', (req, res, next) => {
  let sql =
    'SELECT `purchaseID`, `purchaseDate`, `customerID` FROM `Purchases`';
  let query = mysql.pool.query(sql, (err, results) => {
    if (err) {
      next(err);
      return;
    }
    res.render('purchases', { results: results });
  });
});

// Add a new purchase
app.post('/purchases', (req, res, next) => {
  if (req.body['addPurchase']) {
    mysql.pool.query(
      'INSERT INTO `Purchases` (`purchaseDate`, `customerID`) VALUES (?,?)',
      [req.body.purchaseDate, req.body.customerID],
      (err) => {
        if (err) {
          next(err);
          return;
        }

        let sql =
          'SELECT `purchaseID`, `purchaseDate`, `customerID` FROM `Purchases`';
        let query = mysql.pool.query(sql, (err, results) => {
          if (err) {
            next(err);
            return;
          }
          res.render('purchases', { results: results });
        });
      }
    );
  }
});

//Suppliers
app.get('/suppliers', (req, res, next) => {
  let sql =
    'SELECT `supplierID`, `supplierName`, `supplierPlanet` FROM `Suppliers`';
  let query = mysql.pool.query(sql, (err, results) => {
    if (err) {
      next(err);
      return;
    }
    res.render('suppliers', { results: results });
  });
});

// Add a new supplier
app.post('/suppliers', (req, res, next) => {
  if (req.body['addSupplier']) {
    mysql.pool.query(
      'INSERT INTO `Suppliers` (`supplierName`, `supplierPlanet`) VALUES (?,?)',
      [req.body.name, req.body.planet],
      (err) => {
        if (err) {
          next(err);
          return;
        }

        let sql =
          'SELECT `supplierID`, `supplierName`, `supplierPlanet` FROM `Suppliers`';
        let query = mysql.pool.query(sql, (err, results) => {
          if (err) throw err;
          res.render('suppliers', { results: results });
        });
      }
    );
  }
});

app.listen(app.get('port'), () => {
  console.log(
    `Express started on http://flip3.engr.oregonstate.edu:${app.get(
      'port'
    )}; press Ctrl-C to terminate.`
  );
});
