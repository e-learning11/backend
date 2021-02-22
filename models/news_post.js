const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection").sequelize;

const NewsPost = sequelize.define("NewsPost", {
  title: {
    type: DataTypes.TEXT("long"),
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT("long"),
    allowNull: false,
  },
  image: {
    type: DataTypes.BLOB("medium"),
    allowNull: false,
  },
});

module.exports = NewsPost;
