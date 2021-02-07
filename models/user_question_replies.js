const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection").sequelize;

const UserQuestionsReplies = sequelize.define("UserQuestionsReplies", {
  upvotes: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  downvotes: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = UserQuestionsReplies;
