const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection").sequelize;

const UserQuestionsComment = sequelize.define("UserQuestionsComment", {
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

module.exports = UserQuestionsComment;
