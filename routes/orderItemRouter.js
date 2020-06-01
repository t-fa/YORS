const express = require('express'),
  bodyParser = require('body-parser'),
  mysql = require('../dbcon.js');

const orderItemRouter = express.Router();
orderItemRouter.use(bodyParser.urlencoded({ extended: false }));
orderItemRouter.use(bodyParser.json());

orderItemRouter
.route('/')
.get((req, res, next) => {

      res.render('orderItem');
});

module.exports = orderItemRouter;