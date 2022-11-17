const { Router } = require('express');

const { isValidEmail, isValidPassword } = require('../middlewares/handleLogin');
const { generateToken } = require('../middlewares/handleTalkers.js');

const loginRoute = Router();

loginRoute.post('/', isValidEmail, isValidPassword, (_req, res) => {
  const token = generateToken();
  return res.status(200).json({ token });
});

module.exports = {
  loginRoute,
};