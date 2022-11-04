const crypto = require('crypto');

const isValidEmail = (req, res, next) => {
  const { email } = req.body;

  if (
    !email
    || !email.includes('@')
    || !email.includes('.com')
  ) res.status(400).json({ message: 'invalid email' });

  next();
};

const isValidPassword = (req, res, next) => {
  const { password } = req.body;

  if (!/^[0-9]{4,8}$/.test(password)) {
    return res.status(400).json({ message: 'invalid password' });
  }

  next();
};

function token() {
  return crypto.randomBytes(8).toString('hex');
}

module.exports = {
  token,
  isValidEmail,
  isValidPassword,
};