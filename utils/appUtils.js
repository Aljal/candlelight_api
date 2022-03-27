'use strict';

const isNull = (value) => {
  if (Array.isArray(value) && value.length === 0) return true;
  return ['', null, undefined].includes(value);
};

const getParameters = (req) => ({ ...req.body, ...req.param });

module.exports = {
  isNull,
  getParameters,
};
