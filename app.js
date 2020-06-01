const express = require('express'),
  app = express(),
  handlebars = require('express-handlebars'),
  helpers = require('handlebars-helpers')(),
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

//Items
app.use('/items', itemRouter);

//Purchases
app.use('/purchases', purchaseRouter);

//Suppliers
app.use('/suppliers', supplierRouter);

// Displays the 404 error page if the status is 404
app.use((req, res) => {
  res.status(404);
  res.render('404');
});

// Displays the 500 error page if the status is 500
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), () => {
  console.log(
    `Express started on http://flip3.engr.oregonstate.edu:${app.get(
      'port'
    )}; press Ctrl-C to terminate.`
  );
});
