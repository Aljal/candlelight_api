'use srtict';

const knex = require('../db/connection').knex;

const getProductOptions = async (req, res) => {
  const productOptions = await knex.select().table('product_options');
  res.status(200).send(productOptions);
};

module.exports = {
  getProductOptions
};
