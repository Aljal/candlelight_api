'use strict'

const dotenv = require('dotenv');

dotenv.config();

const {
  PORT,
  PG_USER,
  PG_PASSWD,
  PG_HOST,
  PG_DATA_BASE
} = process.env;

const knex = require('knex')({
  client: 'postgres',
  connection: {
    host : PG_HOST,
    port : PORT,
    user : PG_USER,
    password : PG_PASSWD,
    database : PG_DATA_BASE
  }
});
