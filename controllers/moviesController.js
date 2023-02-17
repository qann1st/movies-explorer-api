const BadRequestError = require('../errors/BadRequestError');
const movieSchema = require('../models/movieSchema');

module.exports.getMovies = async (req, res, next) => {
  try {
    const movies = await movieSchema.find({});
    res.send(movies);
  } catch (err) {
    next(err);
  }
};

module.exports.createMovie = async (req, res, next) => {
  try {
    const movie = await movieSchema.create(req.body);
    res.send(movie);
  } catch (err) {
    next(new BadRequestError('Некорректно заполнены поля'));
  }
};

module.exports.deleteMovie = async (req, res, next) => {
  try {
    const deletedMovie = await movieSchema.findByIdAndDelete(req.params.id);
    if (deletedMovie === null) {
      throw new BadRequestError('Такой карточки не существует');
    }
    res.send(deletedMovie);
  } catch (err) {
    next(err);
  }
};
