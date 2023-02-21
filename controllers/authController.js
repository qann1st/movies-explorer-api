const userSchema = require('../models/userSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');

module.exports.signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const findUser = await userSchema.findOne({ email }).select('+password');
    if (!findUser) {
      throw new BadRequestError('Неправильные почта или пароль');
    }

    const token = await jwt.sign(
      { _id: findUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    );
    const matched = await bcrypt.compare(password, findUser.password);
    if (!matched) {
      throw new BadRequestError('Неправильные почта или пароль');
    }

    res.cookie('token', token, {
      maxAge: 604800000,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.send({ token });
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Некорректно введены данные' });
    } else {
      next(err);
    }
  }
};

module.exports.logout = async (req, res, next) => {
  try {
    if (req.cookies.token === undefined) {
      throw new BadRequestError('Вы не авторизованы');
    }

    res.cookie('token', '', {
      maxAge: -1,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.send({ message: 'Вы успешно деавторизовались' });
  } catch (err) {
    next(err);
  }
};

module.exports.signUp = async (req, res, next) => {
  try {
    let { email, password, name } = await req.body;
    email.toLowerCase();

    const user = await userSchema.findOne({ email });
    if (user !== null) {
      throw new ConflictError('Пользователь уже существует');
    }

    password = await bcrypt.hash(password, 10);
    const newUser = await userSchema.create({
      email,
      password,
      name,
    });
    res.status(201).send(newUser);
  } catch (err) {
    next(err);
  }
};
