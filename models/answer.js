const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection").sequelize;

const Answer = sequelize.define("Answer", {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Answer;
