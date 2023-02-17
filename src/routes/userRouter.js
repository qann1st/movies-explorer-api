const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getNowUser, editNowUser } = require('../controllers/userController');

router.get('/me', getNowUser);
router.patch(
  '/me',
  editNowUser,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
    }),
  }),
);

module.exports.userRouter = router;
