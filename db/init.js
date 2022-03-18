'use strict';

const knex = require('./connection').knex;

(async () => {
  await knex.schema.hasTable('addresses').then(async function (exist) {
    if (!exist) {
      console.log('Create table addresses');
      return await knex.schema.createTable('addresses', function (t) {
        t.increments('id').primary();
        t.string('first_part', 100);
        t.string('seccond_part', 100);
        t.string('city', 100);
        t.string('zip_code', 100);
        t.string('country', 100);
      });
    } else {
      console.log('Table addresses already exist');
    }
  });

  await knex.schema.hasTable('users').then(async function (exist) {
    if (!exist) {
      console.log('Create table users');
      return await knex.schema.createTable('users', function (t) {
        t.increments('id').primary();
        t.string('first_name', 100);
        t.string('last_name', 100);
        t.string('hash');
        t.string('email').unique();
        t.string('phone', 100);
        t.datetime('birthday');
        t.boolean('active');
        t.integer('delivery_address_id').references('id').inTable('addresses').onDelete('cascade');
        t.integer('billing_address_id').references('id').inTable('addresses').onDelete('cascade');
      });
    } else {
      console.log('Table users already exist');
    }
  });

  await knex.schema.hasTable('product_options').then(async function (exist) {
    if (!exist) {
      console.log('Create table product_options');
      return await knex.schema.createTable('product_options', function (t) {
        t.increments('id').primary();
        t.string('name', 100);
        t.integer('price');
        t.integer('quantity');
        t.boolean('active');
      });
    } else {
      console.log('Table product_options already exist');
    }
  });

  await knex.schema.hasTable('images').then(async function (exist) {
    if (!exist) {
      console.log('Create table images');
      return await knex.schema.createTable('images', function (t) {
        t.increments('id').primary();
        t.string('name', 100);
        t.string('src', 100);
        t.string('alt', 100);
      });
    } else {
      console.log('Table images already exist');
    }
  });

  await knex.schema.hasTable('products').then(async function (exist) {
    if (!exist) {
      console.log('Create table products');
      return await knex.schema.createTable('products', function (t) {
        t.increments('id').primary();
        t.string('name', 100);
        t.text('description');
        t.integer('price');
        t.integer('quantity');
        t.integer('product_option_id').references('id').inTable('product_options').onDelete('cascade');
        t.integer('image_id').references('id').inTable('images').onDelete('cascade');
      });
    } else {
      console.log('Table products already exist');
    }
  });

  await knex.schema.hasTable('orders').then(async function (exist) {
    if (!exist) {
      console.log('Create table orders');
      return await knex.schema.createTable('orders', function (t) {
        t.increments('id').primary();
        t.string('order_id', 100);
        t.datetime('date');
        t.integer('user_id').references('id').inTable('users').onDelete('cascade');
      });
    } else {
      console.log('Table orders already exist');
    }
  });

  await knex.schema.hasTable('order_items').then(async function (exist) {
    if (!exist) {
      console.log('Create table order_items');
      return await knex.schema.createTable('order_items', function (t) {
        t.increments('id').primary();
        t.integer('order_id').references('id').inTable('orders').onDelete('cascade');
        t.integer('product_id').references('id').inTable('products').onDelete('cascade');
      });
    } else {
      console.log('Table order_items already exist');
    }
  });

  process.exit();
})();