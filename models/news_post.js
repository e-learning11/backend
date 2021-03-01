const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection").sequelize;

const NewsPost = sequelize.define("NewsPost", {
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.BLOB("medium"),
    allowNull: true,
  },
});

module.exports = NewsPost;
