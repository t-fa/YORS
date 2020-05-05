const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  handlebars = require('express-handlebars').create({ defaultLayout: 'main' }),
  mysql = require('mysql');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

// confirm whether we want to use dateStrings - I used it for 290
pool = mysql.createPool({
  connectionLimit: 10,
  host: '',
  user: '',
  password: '',
  database: '',
  dateStrings: '',
});

app.get('/', (req, res) => res.render('index'));

app.listen(app.get('port'), function () {
  console.log(
    'Express started on http://flipX.engr.oregonstate.edu:' +
      app.get('port') +
      '; press Ctrl-C to terminate.'
  );
});
