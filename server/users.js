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
  // Check for missing quired fields
  let missingFields = [];
  userFields.forEach((field) => {
    if (isNull(user[field])) {
      missingFields.push(field);
    }
  });
  if (missingFields.length > 0) {
    return res.status(400).send({ message: `Missing field ${missingFields.join(', ')}` });
  }
  // Hash password
  let hash;
  try {
    hash = bcrypt.hashSync(user.password, salt);
  } catch (e) {
    console.error(e);
    return res.status(500).send({ message: 'Password hash failed' });
  }
  // Delete password from user
  delete user.password;
  // Save user and hash as active
  try {
    console.log('Before insert:', user);
    await knex('users').insert({ ...user, active: true, hash });
    return res.status(200).send(user);
  } catch (e) {
    console.error(e);
    if (!isNull(e.routine) && e.routine === 'DateTimeParseError') {
      return res.status(400).send({ message: 'Wrong parameter: birthday date' });
    }
    if (!isNull(e.constraint) && e.constraint === 'users_email_unique') {
      return res.status(409).send({ message: 'Email already exist' });
    }
    return res.status(400).send({ message: 'Unknow insert error' });
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