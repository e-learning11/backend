const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection").sequelize;

const Question = sequelize.define("Question", {
  Q: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "please enter question for the course question",
      },
    },
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
