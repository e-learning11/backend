const { Sequelize } = require("sequelize");

// create db instance connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER_NAME,
  process.env.DB_USER_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT,
    define: {
      charset: "utf8",
      collate: "utf8_general_ci",
    },
    logging: false,
  }
);
module.exports.sequelize = sequelize;
/**
 * connectDB
 * connects to Database server
 */
module.exports.connectDB = async function () {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Connection has been established successfully.");
    return sequelize;
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
