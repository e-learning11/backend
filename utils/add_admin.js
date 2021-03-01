const User = require("../models/user");
const CONSTANTS = require("./const");
const hashModule = require("./hash");
/**
 * addAdmin
 */
module.exports = async function () {
  const admin = await User.findOne({
    where: {
      type: CONSTANTS.ADMIN,
    },
  });
  if (!admin) {
    const pass = await hashModule.hashString(process.env.ADMIN_PASSWORD);
    await User.create({
      type: CONSTANTS.ADMIN,
      email: process.env.ADMIN_EMAIL,
      password: pass,
      firstName: "admin",
      lastName: "admin",
      phone: "0000000000",
      age: 0,
      gender: 1,
      approved: true,
    });
  } else {
    const pass = await hashModule.hashString(process.env.ADMIN_PASSWORD);

    admin.email = process.env.ADMIN_EMAIL;
    admin.password = pass;
    await admin.save();
  }
};
