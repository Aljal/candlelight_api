'use strict';

const dotenv = require('dotenv');

dotenv.config();

const {
  PG_PORT,
  PG_USER,
  PG_PASSWD,
  PG_HOST,
  PG_DATA_BASE,
  NODE_ENV,
} = process.env;

const knex = require('knex')({
  client: 'postgres',
  debug: NODE_ENV === 'development',
  connection: {
    host : PG_HOST,
    port : PG_PORT,
    user : PG_USER,
    password : PG_PASSWD,
    database : PG_DATA_BASE,
  },
});

module.exports = {
  knex
};