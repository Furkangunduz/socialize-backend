const { ApiError } = require('../helpers/ApiError');
const { asyncHandler } = require('../helpers/asyncHandler');
const { ApiResponse } = require('../helpers/ApiResponse');

const { RelationShip } = require('../models/relationShip');
const { User } = require('../models/user.model');

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

    Promise.all([
      User.findOneAndUpdate({ _id: followingId }, { $addToSet: { followers: followerId } }, { new: true }),
      User.findOneAndUpdate({ _id: followerId }, { $addToSet: { following: followingId } }, { new: true }),
    ]);

    return res.status(200).json(new ApiResponse(200, null, 'User followed successfully'));
  } catch (error) {
    return res.status(500).json(new ApiError(500, null, error.message));
  }
});

module.exports = { followUser };
