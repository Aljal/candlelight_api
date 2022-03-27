'use strict';

const knex = require('../db/connection').knex;
const moment = require('moment');

const { isNull, getParameters } = require('../utils/appUtils');

const { checkToken } = require('./users');

// TODO: refacto to choose variables name between camel case and snake case
const createOrder = async (req, res) => {
  // products should be an array of product id and product_option id, ex: [{productId: 2, productOptionId: 1}]
  const { products } = getParameters(req);
  const userId = checkToken(req, res);
  if (!userId) return;
  const date = moment();
  const formatedDate = date.format('YYYY-MM-DD');
  try {
    let count = await knex('orders').where('date', formatedDate);
    count = String(count.length);
    const order_id = date.format(`YYYYMMDD${'000'.slice(count.length) + count}`);
    const id = await knex('orders').insert({ order_id, date: formatedDate, user_id: userId }, 'id');
    for (let product of products) {
      knex('order_items').insert({
        product_id: product.productId,
        product_option_id: productOptionId,
        order_id: id[0],
      });
    }
    res.status(201).send();
  } catch (e) {
    // TODO: send appropriate error status code
    res.status(500).send({ message: e.message });
  }
};

const getOrders = async (req, res) => {
  const userId = checkToken(req, res);
  if (!userId) return;
  const orders = await knex('orders').where('user_id', userId);
  res.status(200).send(orders);
};

module.exports = {
  createOrder,
  getOrders,
}