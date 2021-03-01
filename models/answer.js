const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection").sequelize;

const Answer = sequelize.define("Answer", {
  A: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: {
        msg: "please enter answer for the question",
      },
    },
  },
});

module.exports = Answer;
