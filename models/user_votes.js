const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection").sequelize;
const CONSTANTS = require("../utils/const");
const UserVote = sequelize.define("UserVote", {
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: {
        args: [[CONSTANTS.FORUM_QUESTION, CONSTANTS.FORUM_REPLY]],
        msg: "please use right value for type",
      },
    },
  },
  vote: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: {
        args: [[CONSTANTS.FORUM_UPVOTE, CONSTANTS.FORUM_DOWNVOTE]],
        msg: "please user right value for vote",
      },
    },
  },
  typeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = UserVote;
