const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection").sequelize;

const Prequisite = sequelize.define("Prequisite", {});

module.exports = Prequisite;
