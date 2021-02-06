const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection").sequelize;

const Question = sequelize.define("Question", {
  Q: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  correctAnswer: {
    type: DataTypes.INTEGER,
  },
});

module.exports = Question;