const User = require("../models/user");
const Course = require("../models/courses");
const errorHandler = require("../utils/error");
const CONSTANTS = require("../utils/const");

/**
 * getImage
 * @param {Request} req
 * @param {Response} res
 * stream imaghe based on the id of its owner
 */
async function getImage(req, res) {
  try {
    const { owner, id } = req.query;
    switch (owner) {
      case CONSTANTS.USER: {
        const user = await User.findOne({
          where: { id: Number(id) },
        });
        res.end(user.image, "binary");
        break;
      }
      case CONSTANTS.COURSE: {
        const course = await Course.findOne({
          where: { id: Number(id) },
        });
        res.end(course.image, "binary");
        break;
      }
      default:
        throw new Error({ errors: [{ message: "not valid owner or id" }] });
    }
  } catch (ex) {
    console.log(ex);
    errorHandler(req, res, ex);
  }
}

module.exports = {
  getImage,
};
