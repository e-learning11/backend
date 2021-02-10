const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection").sequelize;

const UserQuestions = sequelize.define("UserQuestions", {
  votes: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
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
  tags: {
    allowNull: true,
    type: DataTypes.TEXT,
  },
});

module.exports = UserQuestions;
