'use strict';

const products = require('./products');
const { getOrders, createOrder } = require('./orders');
const {
  getAllUsers,
  createUsers,
  updateUsers,
  login
} = require('./users');
const { getProducts } = products;

const inProgress = (req, res) => res.status(501).send({ message: 'In progress' });

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the candlelight API!'
  }));

  // Users
  app.post('/api/users', createUsers);
  app.get('/api/users', getAllUsers);
  app.patch('/api/users/:id', updateUsers);
  app.post('/api/users/login', login);

  // Products
  app.get('/api/products', getProducts);

  // Orders
  app.get('/api/orders', getOrders);
  app.post('/api/orders', createOrder);
  app.patch('/api/orders/:id', inProgress);
  app.delete('/api/orders/:id', inProgress);
};