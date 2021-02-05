const User = require("../models/user");
const hashModule = require("../utils/hash");
const authenticationModule = require("../utils/authentication");

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
      email: email,
    });
    if (await hashModule.compareStringWithHash(password, user.password)) {
      const token = authenticationModule.createToken(user.id);
      res.status(200).send(token).end();
    }
  } catch (ex) {}
}

/**
 * signup
 * @param {Request} req
 * @param {Response} res
 * function to create new user if everything is correct
 */
async function signup(req, res) {
  try {
    const { email, password, phone, firstName, lastName, type } = req.body;
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
    });

    const token = authenticationModule.createToken(user.id);
    res.status(200).send(token).end();
  } catch (ex) {
    console.log(ex);
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
        },
      })
      .end();
  } catch (ex) {}
}

module.exports = {
  login,
  signup,
  getProfile,
};
