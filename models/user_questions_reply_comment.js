const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection").sequelize;

const UserQuestionsRepliesComment = sequelize.define(
  "UserQuestionsRepliesComment",
  {
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: {
          args: [1, 100000],
          msg: "reply must be at least 1 charachter",
        },
      },
    },
  }
);

module.exports = UserQuestionsRepliesComment;
