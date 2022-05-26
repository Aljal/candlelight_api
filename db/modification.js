'use strict';

const knex = require('./connection').knex;

const modification = async () => {
  return await knex('product_options')
    .where('name', '=', 'wood_wick')
    .update({ active: false });
};

modification();