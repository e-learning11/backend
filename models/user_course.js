const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection").sequelize;

const UserCourse = sequelize.define("UserCourse", {
  type: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: {
        msg: "please enter type for the user course",
      },
    },
  },
  currentComponent: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = UserCourse;
