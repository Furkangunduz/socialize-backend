const { ApiError } = require('../helpers/ApiError');
const { ApiResponse } = require('../helpers/ApiResponse');
const { asyncHandler } = require('../helpers/asyncHandler');
const { User } = require('../models/user.model');

/**
 * @route GET /users/get-user
 *  @param {string} req.query.userId - The user ID of requested user.
 */
const getUser = asyncHandler(async function (req, res) {
  try {
    const { userId } = req.query;

    const user = await User.findById(userId).select('-password -savedPosts -isEmailVerified -updatedAt -role').lean();

    if (!user) {
      return res.status(404).json(new ApiError(404, null, 'User not found'));
    }

    return res.status(200).json(new ApiResponse(200, user, 'User found'));
  } catch (error) {
    return res.status(500).json(new ApiError(500, null, error.message));
  }
});

module.exports = { getUser };
