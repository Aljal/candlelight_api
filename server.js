'use strict';

// Includes
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
var cors = require('cors');

const { checkToken } = require('./server/users');
const knex = require('./db/connection').knex;

require('dotenv').config();

const STRIPE_API_KEY = process.env.NODE_ENV === 'development'
  ? process.env.STRIPE_API_KEY_TEST
  : process.env.STRIPE_API_KEY_PRODUCTION;

const stripe = require('stripe')(STRIPE_API_KEY);

const host = process.env.HOST;
const port = process.env.PORT;

var app = express()

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs/access.log'), { flags: 'a' })

// Log requests to the access.log
app.use(morgan(':remote-addr\t:method\t:url\t:status\t:response-time ms\t:date[web]', {
  stream: {
    write(log) {
      accessLogStream.write(log);
      console.log(log);
    }
  }
}));

// Index.html at root
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// App images
app.use('/api/public', express.static(__dirname + '/public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something something went wrong' });
});

// Require our routes into the application.
require('./server/routes')(app);

// Create payment order
app.post('/api/process-payment', async (req, res) => {
  const { items } = req.body;
  if (!checkToken(req, res)) return;

  const products = await knex.select().table('products');
  const productOptions = await knex.select().table('product_options');
  let amount = 5;
  items.forEach((item) => {
    const currentProduct = products.find(product => product.id === item.id);
    const currentOption = productOptions.find(option => option.id === item.option.id);
    console.log('currentProduct:', currentProduct.price, ', currentOption:', currentOption.price);
    amount += currentProduct.price + currentOption.price;
  });
  amount *= 100;

  console.log('amount:', amount);

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'eur',
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

// Return default result for not in routes post requests
app.post('*', (req, res) => {
  console.log('POST Request: ' + JSON.stringify(req.body));
  return res.status(404).send({
    error: 'URL not found'
  });
});

// Define port - ip and start server
var server = app.listen(port, host, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Server listening at http://%s:%s', host, port)
})

module.exports = app;