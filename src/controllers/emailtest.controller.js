const { ApiResponse } = require('../helpers/ApiResponse.js');
const { asyncHandler } = require('../helpers/asyncHandler.js');
const { sendMail } = require('../services/email.service.js');

const emailtest = asyncHandler(async (req, res) => {
  sendMail();
  res.status(200).json(new ApiResponse(200, null, 'Email Sent'));
});

module.exports = {
  emailtest,
};
