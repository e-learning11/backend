const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection").sequelize;

const UserQuestions = sequelize.define("UserQuestions", {
  upvotes: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  downvotes: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = UserQuestions;
