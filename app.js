const express = require('express'),
  mysql = require('./dbcon.js'),  // Storing credentials in another file
  app = express(),
  bodyParser = require('body-parser'),
  handlebars = require('express-handlebars').create({ defaultLayout: 'main' }),
  path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);

// Index Page
app.get('/', (req, res) => res.render('index'));

//Customers
app.get('/customers', (req, res) => res.render('customers'));

//Orders
app.get('/orders', (req, res) => res.render('orders'));

//Edit Orders
app.get('/editOrder', (req, res) => res.render('editOrder'));

//Items
app.get('/items', (req, res) => res.render('items'));

//OrderItem
app.get('/orderItem', (req, res) => res.render('orderItem'));

//Purchases
app.get('/purchases', (req, res) => res.render('purchases'));

//Suppliers
app.get('/suppliers', (req, res) => res.render('suppliers'));



app.listen(app.get('port'), function () {
  console.log(
    'Express started on http://flip3.engr.oregonstate.edu:' +
      app.get('port') +
      '; press Ctrl-C to terminate.'
  );
});
