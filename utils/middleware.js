const User = require("../models/user");
const CONSTANTS = require("./const");
/**
 * checkUserApproval
 * @param {Request} req
 * @param {Response} res
 * @param {Object} next
 * check that user is approved from admin
 */
async function checkUserApproval(req, res, next) {
  try {
    const id = req.user.id;
    const user = await User.findOne({
      where: {
        id: id,
      },
    });
    if (!user) throw new Error();
    if (user.type == CONSTANTS.TEACHER && !user.approved) {
      res
        .status(400)
        .send(
          "Your account is not approved yet by the Admin, please wait till approval and try again later."
        );
    } else {
      next();
    }
  } catch (ex) {
    console.log(ex);
    res.status(400).send("error has occured");
  }
}
/**
 * checkUserAdmin
 * @param {Request} req
 * @param {Response} res
 * @param {Object} next
 * check that user is approved from admin
 */
async function checkUserAdmin(req, res, next) {
  try {
    const id = req.user.id;
    const user = await User.findOne({
      where: {
        id: id,
      },
    });
    if (!user) throw new Error();
    if (user.type != CONSTANTS.ADMIN) {
      res.status(400).send("user is not admin");
    } else {
      next();
    }
  } catch (ex) {
    console.log(ex);
    res.status(400).send("error has occured");
  }
}

module.exports = {
  checkUserApproval,
  checkUserAdmin,
};
