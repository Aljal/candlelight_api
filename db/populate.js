'use strict';

const knex = require('./connection').knex;

const product_options = [
  {
    name: 'Mèche en coton',
    price: 0,
    quantity: 100,
    active: true,
  },
  {
    name: 'Mèche en coton',
    price: 0,
    quantity: 60,
    active: true,
  },
];

const products = [
  {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    product_option_id: null,
    image_id: null,
  },
];

const tables = {
  product_options,
  // products,
};

  (async () => {
    for (let key of Object.keys(tables)) {
      await knex(key).insert(tables[key]);
    }
  })();
