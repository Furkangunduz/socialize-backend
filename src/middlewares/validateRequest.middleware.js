const { ApiError } = require('../helpers/ApiError');

const validateRequest = (schema) => async (req, res, next) => {
  const dataToValidate = Object.assign({}, req.body, req.query, req.params);

  const { error } = schema.validate(dataToValidate);
  if (error) {
    return res.status(400).json(new ApiError(400, 'Validation Error', error.details.map((e) => e.message).join(', ')));
  }
  next();
};

module.exports = {
  validateRequest,
};
