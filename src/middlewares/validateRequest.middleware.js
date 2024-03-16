const { ApiError } = require('../utils/ApiError');

function validateRequest({ req, res, next, schema }) {
  return async (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      console.log('error', error);
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            'Validation Error',
            error.details.map((e) => e.message).join(', ')
          )
        );
    }
    next();
  };
}

module.exports = { validateRequest };
