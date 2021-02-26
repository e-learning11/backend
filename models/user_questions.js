const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection").sequelize;

const UserQuestions = sequelize.define("UserQuestions", {
  votes: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: {
        args: [1, 500],
        msg:
          "title must be at least 1 charachter and less than 500 charachters",
      },
    },
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: {
        args: [1, 100000],
        msg: "question must be at least 1 charachter",
      },
    },
  },
  tags: {
    allowNull: false,
    type: DataTypes.TEXT,
    validate: {
      notNull: {
        msg: "please enter tags",
      },
    },
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = UserQuestions;
