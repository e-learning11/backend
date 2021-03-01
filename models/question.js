const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection").sequelize;

const Question = sequelize.define("Question", {
  Q: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: {
        msg: "please enter question for the course question",
      },
    },
  },
  type: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  correctAnswer: {
    type: DataTypes.TEXT,
  },
});

module.exports = Question;
