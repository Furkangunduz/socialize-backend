const { Schema, model } = require('mongoose');

const relationShipSchema = new Schema({
  follower: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  following: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

const RelationShip = model('relationShip', relationShipSchema);

module.exports = { RelationShip };
