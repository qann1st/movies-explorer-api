const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
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
    const movie = await movieSchema.create({
      ...req.body,
      owner: req.user._id,
    });
    res.send(movie);
  } catch (err) {
    console.log(err);
    next(new BadRequestError('Некорректно заполнены поля'));
  }
};

module.exports.deleteMovie = async (req, res, next) => {
  try {
    const deletedMovie = await movieSchema.findByIdAndDelete(req.params.id);
    if (deletedMovie === null) {
      throw new BadRequestError('Такой карточки не существует');
    }
    if (deletedMovie.owner._id !== req.user._id) {
      throw new ConflictError('Нельзя удалить чужой фильм');
    }
    res.send(deletedMovie);
  } catch (err) {
    next(err);
  }
};
