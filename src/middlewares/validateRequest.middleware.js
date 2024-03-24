const { ApiError } = require('../utils/ApiError');

const validateRequest = (schema) => async (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json(new ApiError(400, 'Validation Error', error.details.map((e) => e.message).join(', ')));
  }
  next();
};

module.exports = {
  validateRequest,
};
