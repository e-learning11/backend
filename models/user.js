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
    },
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "please enter lastname for the user",
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
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "please enter phone for the user",
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
    },
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: "please enter age for the user",
      },
    },
  },
});

module.exports = User;
