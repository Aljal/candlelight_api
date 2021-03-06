'use strict';

const isNull = (value) => {
  if (Array.isArray(value) && value.length === 0) return true;
  return ['', null, undefined].includes(value);
};

const getParameters = (req) => ({ ...req.body, ...req.param });

const calculateOrderAmount = (items) => {
  let amount = 0;
  items.forEach(item => {
    amount += item.price;
  });
  return amount;
};

module.exports = {
  isNull,
  getParameters,
  calculateOrderAmount,
};
