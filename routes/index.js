const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { signIn, signUp } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const { moviesRouter } = require('./moviesRouter');
const { userRouter } = require('./userRouter');

router.use('/users', authMiddleware, userRouter);
router.use('/movies', authMiddleware, moviesRouter);
router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  signIn,
);
router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
    }),
  }),
  signUp,
);
router.use('*', authMiddleware, (req, res) =>
  res.status(404).send({ message: 'Роут не найден' }),
);

module.exports = router;
