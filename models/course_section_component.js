const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection").sequelize;

const CourseSectionComponent = sequelize.define("CourseSectionComponent", {
  number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: "please enter number for the course compoenent",
      },
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "please enter name for the course compoenent",
      },
    },
  },
  videoID: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "please enter type for the course compoenent",
      },
    },
  },
  file: {
    type: DataTypes.BLOB("long"),
    allowNull: true,
  },
  passingGrade: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = CourseSectionComponent;
