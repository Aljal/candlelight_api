'use strict';

const jwt = require('jsonwebtoken');

module.exports = {
  getUserId: (authorization) => {
    let userId = null;
    const token = authorization?.replace('Bearer ', '');
    if (token) {
      try {
        const jwToken = jwt.verify(token, process.env.JWT_SECRET);
        userId = jwToken?.id;
      } catch (e) {
        console.error('jwt.verify failed:', e.message);
      }
    }
    return userId;
  },
  generateToken: (user) => {
    const expirationHours = process.env.JWT_EXPIRATION_HOURS;
    const {
      id,
      email,
      phone,
      birthday,
      last_name,
      first_name,
      billing_address_id,
      delivery_address_id,
    } = user;
    const token = jwt.sign(
      {
        id,
        email,
        phone,
        birthday,
        last_name,
        first_name,
        billing_address_id,
        delivery_address_id,
      },
      process.env.JWT_SECRET,
      {
        algorithm: 'HS256',
        expiresIn: expirationHours
      }
    );
    return { token };
  }
}