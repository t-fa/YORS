const express = require('express'),
  mysql = require('./dbcon.js'), // Storing credentials in another file
  app = express(),
  handlebars = require('express-handlebars'),
  path = require('path'),
  bodyParser = require('body-parser'),
  orderRouter = require('./routes/orderRouter'),
  customerRouter = require('./routes/customerRouter'),
  itemRouter = require('./routes/itemRouter'),
  purchaseRouter = require('./routes/purchaseRouter'),
  supplierRouter = require('./routes/supplierRouter');

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
app.use('/items', itemRouter);

//Purchases
app.use('/purchases', purchaseRouter);

//Suppliers
app.use('/suppliers', supplierRouter);

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

app.listen(app.get('port'), () => {
  console.log(
    `Express started on http://flip3.engr.oregonstate.edu:${app.get(
      'port'
    )}; press Ctrl-C to terminate.`
  );
});
