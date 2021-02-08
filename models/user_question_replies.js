const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection").sequelize;

const UserQuestionsReplies = sequelize.define("UserQuestionsReplies", {
  upvotes: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  downvotes: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [1, 100000],
        msg: "reply must be at least 1 charachter",
      },
    },
  },
});

module.exports = UserQuestionsReplies;
