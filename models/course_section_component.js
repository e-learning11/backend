const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection").sequelize;

const CourseSectionComponent = sequelize.define("CourseSectionComponent", {
  number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  videoID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = CourseSectionComponent;
