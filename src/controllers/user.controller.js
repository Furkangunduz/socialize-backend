const { ApiError } = require('../helpers/ApiError');
const { ApiResponse } = require('../helpers/ApiResponse');
const { asyncHandler } = require('../helpers/asyncHandler');
const { User } = require('../models/user.model');
const { RelationShip } = require('../models/relationShip');

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

/**
 * @route POST /users/follow-user
 * @param {string} req.body.followingUserId - The user ID of the user to follow.
 */
const followUser = asyncHandler(async function (req, res) {
  try {
    const followerId = req.userId;
    const followingId = req.body.followingUserId;

    const existingRelationship = await RelationShip.findOne({ follower: followerId, following: followingId });

    if (existingRelationship) {
      return res.status(400).json(new ApiError(400, null, 'User already followed'));
    }

    const newRelationship = new RelationShip({
      follower: followerId,
      following: followingId,
    });
    await newRelationship.save();

    await Promise.all([
      User.findOneAndUpdate({ _id: followingId }, { $addToSet: { followers: followerId } }, { new: true }),
      User.findOneAndUpdate({ _id: followerId }, { $addToSet: { following: followingId } }, { new: true }),
    ]);

    return res.status(200).json(new ApiResponse(200, null, 'User followed successfully'));
  } catch (error) {
    return res.status(500).json(new ApiError(500, null, error.message));
  }
});

/**
 * @route POST /users/unfollow-user
 * @param {string} req.body.followingUserId - The user ID of the user to unfollow.
 */
const unfollowUser = asyncHandler(async function (req, res) {
  try {
    const followerId = req.userId;
    const followingId = req.body.followingUserId;

    const existingRelationship = await RelationShip.findOne({ follower: followerId, following: followingId });

    if (!existingRelationship) {
      return res.status(400).json(new ApiError(400, null, 'User not followed'));
    }

    await existingRelationship.deleteOne();

    await Promise.all([
      User.findOneAndUpdate({ _id: followingId }, { $pull: { followers: followerId } }, { new: true }),
      User.findOneAndUpdate({ _id: followerId }, { $pull: { following: followingId } }, { new: true }),
    ]);

    return res.status(200).json(new ApiResponse(200, null, 'User unfollowed successfully'));
  } catch (error) {
    return res.status(500).json(new ApiError(500, null, error.message));
  }
});

module.exports = { getUser, followUser, unfollowUser };
