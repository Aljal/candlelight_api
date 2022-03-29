'use strict';

const knex = require('./connection').knex;

// users has 2 addresses
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

  // -> user has may orders and 2 adresses (billing and delivery)
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

  // <- product_images has one image
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

  // <- Product has one collection
  await knex.schema.hasTable('collections').then(async function (exist) {
    if (!exist) {
      console.log('Create table collections');
      return await knex.schema.createTable('collections', function (t) {
        t.increments('id').primary();
        t.string('name', 100);
      });
    } else {
      console.log('Table collections already exist');
    }
  });

  // <- orders has many produts
  // -> product has one collection
  await knex.schema.hasTable('products').then(async function (exist) {
    if (!exist) {
      console.log('Create table products');
      return await knex.schema.createTable('products', function (t) {
        t.increments('id').primary();
        t.string('ref').unique();
        t.string('name', 100);
        t.text('description');
        t.integer('price');
        t.integer('weigth');
        t.integer('quantity');
        t.integer('collection_id').references('id').inTable('collections').onDelete('cascade');
      });
    } else {
      console.log('Table products already exist');
    }
  });

  // <- order_item has one product_options
  await knex.schema.hasTable('product_options').then(async function (exist) {
    if (!exist) {
      console.log('Create table product_options');
      return await knex.schema.createTable('product_options', function (t) {
        t.increments('id').primary();
        t.string('name', 100);
        t.string('description', 100);
        t.integer('price');
        t.integer('quantity');
        t.boolean('active');
      });
    } else {
      console.log('Table product_options already exist');
    }
  });

  // <- product has many product_images
  // -> product_imges has one product and one image
  await knex.schema.hasTable('product_images').then(async function (exist) {
    if (!exist) {
      console.log('Create table product_images');
      return await knex.schema.createTable('product_images', function (t) {
        t.increments('id').primary();
        t.integer('order');
        t.integer('product_id').references('id').inTable('products').onDelete('cascade');
        t.integer('image_id').references('id').inTable('images').onDelete('cascade');
      });
    } else {
      console.log('Table product_images already exist');
    }
  });

  // <- user has many orders
  // -> orders has one user and many order_items
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

  // -> order_items has one product, one product_options and one order_id
  await knex.schema.hasTable('order_items').then(async function (exist) {
    if (!exist) {
      console.log('Create table order_items');
      return await knex.schema.createTable('order_items', function (t) {
        t.increments('id').primary();
        t.integer('order_id').references('id').inTable('orders').onDelete('cascade');
        t.integer('product_id').references('id').inTable('products').onDelete('cascade');
        t.integer('product_option_id').references('id').inTable('product_options').onDelete('cascade');
      });
    } else {
      console.log('Table order_items already exist');
    }
  });

  process.exit();
})();