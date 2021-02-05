const { DataTypes } = require("sequelize");

module.exports = async function (sequelize) {
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

  await CourseSectionComponent.sync({ alter: true });
  return CourseSectionComponent;
};
