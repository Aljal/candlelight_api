'use srtict';

const knex = require('../db/connection').knex;

const getCollections = async (req, res) => {
  const collections = await knex.select().table('collections');
  res.status(200).send(collections);
};

module.exports = {
  getCollections
};
