'use strict';

const knex = require('../db/connection').knex;
const { getParameters, isNull } = require('../utils/appUtils');
const { checkToken } = require('./users');

const requiredAddressFields = [
  'first_part',
  'city',
  'country',
  'zip_code',
];

const addressFields = [
  ...requiredAddressFields,
  'second_part',
];

const createAddress = async (req, res) => {
  const id = checkToken(req, res);
  if (!id) return;
  const address = getParameters(req);
  let missingFields = [];
  requiredAddressFields.forEach((field) => {
    if (isNull(address[field])) {
      missingFields.push(field);
    }
  });
  if (missingFields.length > 0) {
    return res.status(400).send({ message: `Missing field ${missingFields.join(', ')}` });
  }
  const address_id = await knex('addresses').insert(address, 'id');
  await knex('users')
    .where('id', '=', id)
    .update({ address_id: address_id[0].id });
  res.status(201).send();
};

const updateAddress = async (req, res) => {
  const id = checkToken(req, res);
  if (!id) return;
  const { id: address_id, ...address } = getParameters(req);
  if (Object.keys(address).some((field) => !addressFields.includes(field))) {
    res.status(400).send({ message: 'Field not allowed' });
  }
  const user = await knex('users').where('id', id);
  if (!user || user.length === 0) {
    return res.status(404).send({ message: 'User not found' });
  }
  await knex('addresses')
    .where('id', '=', address_id)
    .update(address);
  res.status(200).send();
};

module.exports = {
  createAddress,
  updateAddress,
};
