const User = require("../models/user");
const CONSTANTS = require("./const");
const hashModule = require("./hash");
module.exports = async function () {
  const admin = await User.findOne({
    where: {
      type: CONSTANTS.ADMIN,
      email: process.env.ADMIN_EMAIL,
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
  } else if (
    !(await hashModule.compareStringWithHash(
      admin.password,
      process.env.ADMIN_PASSWORD
    ))
  ) {
    await User.destroy({
      where: {
        id: admin.id,
      },
    });
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
  }
};
