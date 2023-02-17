module.exports.error = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).send({ message });

  next();
};
