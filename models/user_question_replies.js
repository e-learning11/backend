const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection").sequelize;

const UserQuestionsReplies = sequelize.define("UserQuestionsReplies", {
  votes: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  isAnswer: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },

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
});

module.exports = UserQuestionsReplies;
