const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  const CourseSection = sequelize.define("CourseSection", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    end: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return CourseSection;
};
