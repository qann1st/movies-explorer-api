const { celebrate, Joi } = require('celebrate');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/moviesController');
const router = require('express').Router();

router.get('/', getMovies);
router.post(
  '/',
  createMovie,
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string()
        .required()
        .uri()
        .regex(/^https?:\/\//i),
      trailerLink: Joi.string()
        .required()
        .uri()
        .regex(/^https?:\/\//i),
      thumbnail: Joi.string()
        .required()
        .uri()
        .regex(/^https?:\/\//i),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
);
router.delete(
  '/:id',
  celebrate({
    params: {
      id: Joi.string().length(24).hex(),
    },
  }),
  deleteMovie,
);

module.exports.moviesRouter = router;
