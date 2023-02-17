const NotFoundError = require('../errors/NotFoundErrors');
const userSchema = require('../models/userSchema');

module.exports.getNowUser = async (req, res, next) => {
  try {
    const user = await userSchema.findById(req.user._id);
    if (user === null) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.send(user);
  } catch (err) {
    next(err);
  }
};
