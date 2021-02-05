const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection").sequelize;

const Answer = sequelize.define("Answer", {
  A: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Answer;
