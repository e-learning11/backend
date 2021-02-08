const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection").sequelize;

/**
 *
 * user 3 types
 * 1 => teacher
 * 2 => student
 * 3 => admin
 */

const User = sequelize.define("User", {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "please enter firstname for the user",
      },
      len: {
        args: [4, 100],
        msg: "minimum of 4 charachters for first name",
      },
    },
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "please enter lastname for the user",
      },
      len: {
        args: [4, 100],
        msg: "minimum of 4 charachters for last name",
      },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      args: true,
      msg: "the email is duplicated",
    },
    validate: {
      isEmail: true,
      notNull: {
        msg: "please enter email for the user",
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "please enter password for the user",
      },
      len: {
        args: [3, 100],
        msg: "minimum of 3 charachters for password name",
      },
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "please enter phone for the user",
      },
      len: {
        args: [8, 100],
        msg: "minimum of 8 charachters for phone ",
      },
    },
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "please enter type for the user",
      },
      isIn: {
        args: [["teacher", "student", "admin"]],
        msg: "type is teacher or student",
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
        msg: "please enter approved for the user",
      },
    },
  },
  gender: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: "please enter gender for the user",
      },
      isIn: {
        args: [[1, 2]],
        msg: "gender is 1 for male and 2 for female",
      },
    },
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: "please enter age for the user",
      },
      min: {
        args: [0],
        msg: "must enter age",
      },
    },
  },
});

module.exports = User;
