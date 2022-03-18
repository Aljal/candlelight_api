'use strict';

const app = require('../server');
const users = require('./users');
const {
  getUsers,
  createUsers,
  updateUsers,
  login
} = users;

const inProgress = (req, res) => res.status(200).send({ message: 'In progress' });

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the candlelight API!'
  }));

  // Users
  app.post('/api/users', createUsers);
  app.get('/api/users', getUsers);
  app.patch('/api/users/:id', updateUsers);
  app.post('/api/users/login', login);

  // Products
  app.get('/api/products', inProgress);

  // Orders
  app.get('/api/orders', inProgress);
  app.post('/api/orders', inProgress);
  app.patch('/api/orders/:id', inProgress);
  app.delete('/api/orders/:id', inProgress);
};