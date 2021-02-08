const User = require("../models/user");
const hashModule = require("../utils/hash");
const authenticationModule = require("../utils/authentication");
const errorHandler = require("../utils/error");
/**
 * login
 * @param {Request} req
 * @param {Response} res
 * function to check if email and password user enterd entered is correct or not
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (await hashModule.compareStringWithHash(password, user.password)) {
      const token = authenticationModule.createToken(user.id);
      res.status(200).send(token).end();
    }
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}

/**
 * signup
 * @param {Request} req
 * @param {Response} res
 * function to create new user if everything is correct
 */
async function signup(req, res) {
  try {
    const {
      email,
      password,
      phone,
      firstName,
      lastName,
      type,
      gender,
      age,
    } = req.body;
    console.log(req.body, req.file);

    const hashedPassword = await hashModule.hashString(password);
    const user = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      phone: phone,
      type: type,
      image: req.file.buffer,
      approved: false,
      gender: gender,
      age: age,
    });

    const token = authenticationModule.createToken(user.id);
    res.status(200).send(token).end();
  } catch (ex) {
    // console.log(ex);
    errorHandler(req, res, ex);
  }
}
/**
 * getProfile
 * @param {Request} req
 * @param {Response} res
 *  get user profile info
 */
async function getProfile(req, res) {
  try {
    const userId = req.user.id;
    const user = await User.findOne({
      id: userId,
    });
    res
      .status(200)
      .json({
        email: user.email,
        data: {
          type: user.type,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          gender: user.gender,
        },
      })
      .end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}
/**
 * editProfile
 * @param {Request} req
 * @param {Response} res
 * edit user profile
 */
async function editProfile(req, res) {
  try {
    const userId = req.user.id;
    const {
      password,
      gender,
      firstName,
      lastName,
      email,
      phone,
      type,
    } = req.body;
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    let hashedPassword = null;
    if (password) hashedPassword = hashModule.hashString(password);
    await User.update(
      {
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        gender: gender || user.gender,
        email: email || user.email,
        phone: phone || user.phone,
        password: hashedPassword || user.password,
      },
      {
        where: {
          id: userId,
        },
      }
    );
    const updatedUser = await User.findOne({
      where: {
        id: userId,
      },
    });
    updatedUser.password = null;
    updatedUser.image = null;
    res.status(200).send(updatedUser).end();
  } catch (ex) {
    console.log(ex);
    errorHandler(req, res, ex);
  }
}

module.exports = {
  login,
  signup,
  getProfile,
  editProfile,
};
