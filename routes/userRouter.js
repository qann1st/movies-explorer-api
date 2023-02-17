const router = require('express').Router();
const { getNowUser } = require('../controllers/userController');

router.get('/me', getNowUser);

module.exports.userRouter = router;
