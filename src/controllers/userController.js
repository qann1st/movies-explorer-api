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

module.exports.editNowUser = async (req, res, next) => {
  try {
    const editedUser = await userSchema.findByIdAndUpdate(
      req.user._id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    res.send(editedUser);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Не удалось изменить пользователя'));
    } else {
      next(err);
    }
  }
};
