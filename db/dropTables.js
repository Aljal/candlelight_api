'use strict';

const knex = require('./connection').knex;

// Drop all tables
(async () => {
  const tables = [
    'users',
    'orders',
    'images',
    'products',
    'addresses',
    'order_items',
    'collections',
    'product_images',
    'product_options',
  ];
  for (let tableName of tables) {
    console.log(`----- Table ${tableName} -----`)
    await knex.schema.hasTable(tableName).then(async function (exist) {
      if (exist) {
        console.log(`Drop table ${tableName}`);
        return await knex.raw(`DROP TABLE ${tableName} CASCADE`);
      } else {
        console.log(`Table ${tableName} does not exist`);
      }
    });
  }

  console.log('All tables deleted');

  process.exit();
})();
