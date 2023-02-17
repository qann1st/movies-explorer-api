const userSchema = require('../models/userSchema');

module.exports.getNowUser = async (req, res, next) => {
  try {
    const user = await userSchema.findById(req.user._id);
    if (user === null) {
      
    }
    res.send(user)
  } catch (err) {
    next(err);
  }
};
