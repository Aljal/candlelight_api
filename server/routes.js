'use strict';

const { getOrders, createOrder } = require('./orders');
const {
  getUser,
  createUsers,
  updateUsers,
  login
} = require('./users');
const { getProductOptions } = require('./productOptions');
const { getProducts } = require('./products');const { getCollections } = require('./collections');
;

const inProgress = (req, res) => res.status(501).send({ message: 'In progress' });

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the candlelight API!'
  }));

  // Users
  app.post('/api/users', createUsers);
  app.get('/api/users', getUser);
  app.patch('/api/users/:id', updateUsers);
  app.post('/api/users/login', login);

  // Products
  app.get('/api/products', getProducts);

  // Products options
  app.get('/api/product_options', getProductOptions);

  // Collections
  app.get('/api/collections', getCollections);

  // Orders
  app.get('/api/orders', getOrders);
  app.post('/api/orders', createOrder);
  app.patch('/api/orders/:id', inProgress);
  app.delete('/api/orders/:id', inProgress);
};