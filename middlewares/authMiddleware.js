const jwt = require('jsonwebtoken');
const BadRequestError = require('../errors/BadRequestError');

module.exports = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new BadRequestError('Необходима авторизация');
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = payload;

    next();
  } catch (err) {
    next(err);
  }
};
