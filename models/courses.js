const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection").sequelize;

const Course = sequelize.define("Course", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "please enter name for the course",
      },
    },
  },
  summary: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "please enter summary for the course",
      },
    },
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "please enter description for the course",
      },
    },
  },
  language: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "please enter language for the course",
      },
    },
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notNull: {
        msg: "please enter date for the course",
      },
    },
  },
  image: {
    type: DataTypes.BLOB("long"),
    allowNull: true,
  },
  approved: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    validate: {
      notNull: {
        msg: "please enter approved for the course",
      },
    },
  },
  private: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    validate: {
      notNull: {
        msg: "please enter private for the course",
      },
    },
  },
  gender: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: "please enter gender for the course",
      },
    },
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: "please enter age for the course",
      },
    },
  },
});

module.exports = Course;
