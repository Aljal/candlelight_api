'use strict';

const knex = require('../db/connection').knex;
const moment = require('moment');

const { getParameters } = require('../utils/appUtils');

const { checkToken } = require('./users');

const getOrderId = (userId) => {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charactersLen = characters.length;
  const randomstringLen = 8;
  let randomString = '';
  for (let i = 0; i < randomstringLen; i++) {
    const random = Math.floor(Math.random() * 100) % charactersLen;
    randomString += characters[random];
  }
  const date = moment();
  const formatedDate = date.format('YYYYMMDD');
  const formatedUserId = '000'.slice(String(userId).length) + userId;
  return `${formatedDate}-${randomString}-${formatedUserId}`;
};

const createOrder = async (req, res) => {
  // products should be an array of product id and product_option id, ex: [{productId: 2, productOptionId: 1}]
  const { products, paymentId } = getParameters(req);
  const userId = checkToken(req, res);
  if (!userId) return;
  try {
    const payment_id = await knex('orders').where('payment_id', paymentId);
    if (payment_id && payment_id.length > 0) {
      return res.status(409).send({message: 'An order already exist for this payment ID'});
    }
    const order_id = getOrderId(userId);
    const id = await knex('orders').insert({
      order_id,
      date: moment().format('YYYY-MM-DD hh:mm:ss'),
      user_id: userId,
      payment_id: paymentId,
    }, 'id');
    for (let product of products) {
      knex('order_items').insert({
        product_id: product.id,
        product_option_id: product.option.id,
        order_id: id[0].id,
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
  const result = orders.map(async (order) => {
    const orderItems = await knex('order_items').where('order_id', order.id);
    return ({ order, orderItems });
  });
  res.status(200).send(result);
};

module.exports = {
  createOrder,
  getOrders,
}