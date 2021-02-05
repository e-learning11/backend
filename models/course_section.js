const { DataTypes } = require("sequelize");

module.exports = async function (sequelize) {
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

  await CourseSection.sync({ alter: true });
  return CourseSection;
};
