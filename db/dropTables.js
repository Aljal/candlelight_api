'use strict';

const knex = require('./connection').knex;

// Drop all tables
(async () => {
  const tables = [
    'order_items',
    'orders',
    'products',
    'images',
    'product_options',
    'users',
    'addresses'
  ];
  for (let tableName of tables) {
    await knex.schema.hasTable(tableName).then(async function (exist) {
      if (exist) {
        console.log(`Drop table ${tableName}`);
        return await knex.schema.dropTable(`${tableName}`);
      } else {
        console.log(`Table ${tableName} does not exist`);
      }
    });
  }

  console.log('All tables deleted');

  process.exit();
})();
