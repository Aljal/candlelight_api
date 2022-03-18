'use strict';

const knex = require('../db/connection').knex;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const { isNull } = require('../utils/appUtils');
const { generateToken, getUserId } = require('../utils/jwtUtils');

const userFields = [
  'email',
  'first_name',
  'last_name',
  'password',
  'birthday',
];

const getParameters = (req) => ({ ...req.body, ...req.param });

const checkToken = (req, res) => {
  const userId = getUserId(req.headers.authorization);
  if (!userId) {
    res.status(401).send({ message: 'Wrong token' });
  }
  return userId;
};

const getUsers = async (req, res) => {
  const result = await knex.select().table('users');
  res.status(200).send(result);
};

const createUsers = async (req, res) => {
  const user = getParameters(req);
  let missingFields = [];
  userFields.forEach((field) => {
    if (isNull(user[field])) {
      missingFields.push(field);
    }
  });
  if (missingFields.length > 0) {
    return res.status(400).send({ message: `Missing field ${missingFields.join(', ')}` });
  }
  try {
    const result = await knex('users').insert({ ...user, active: true });
    res.status(200).send(result);
  } catch (e) {
    console.error(e);
    res.status(409).send({ message: 'Email already exist' });
  }
};

const updateUsers = async (req, res) => {
  const id = checkToken(req, res);
  if (!id) return;
  const { password, ...user } = getParameters(req);
  if (Object.keys(user).some(field => !userFields.includes(field))) {
    return res.status(400).send({ message: 'Field not allowed' });
  }
  const hash = !isNull(password) ? bcrypt.hashSync(password, salt) : undefined;
  const result = await knex('users')
    .where('id', '=', id)
    .update({ hash, ...user });
  res.status(200).send(result);
};

const login = async (req, res) => {
  const { email, password } = getParameters(req);
  const user = await knex('users').where('email', email);
  if (!user) {
    return res.status(404).send({ message: 'User not found' });
  }
  if (bcrypt.compareSync(password, user.hash)) {
    return res.status(200).send({ token: generateToken(user) });
  }
  res.status(403).send({ message: 'Wrong password' });
};

module.exports = {
  getUsers,
  createUsers,
  updateUsers,
  login
}