const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET;

const addUserToLocals = async (req, res, next) => {
  res.locals.user = null;
  
  let token = null;
  
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }
  
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  
  if (!token && req.query.token) {
    token = req.query.token;
  }
  
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findByPk(decoded.id, {
        attributes: ['id', 'name', 'firstName', 'lastName', 'email']
      });
      
      if (user) {
        res.locals.user = user;
        req.user = user;
      }
    } catch (err) {
      console.log('Invalid token:', err.message);
    }
  }
  
  next();
};

module.exports = addUserToLocals;