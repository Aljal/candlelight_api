'use strict';

const knex = require('../db/connection').knex;

const getProducts = async (req, res) => {
  const result = await knex.select().table('products');
  res.status(200).send(result);
};

module.exports = {
  getProducts
};
