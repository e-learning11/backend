const User = require("../models/user");
const Course = require("../models/courses");
const errorHandler = require("../utils/error");
const CONSTANTS = require("../utils/const");
const path = require("path");
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
        //console.log(user.image, __dirname);
        if (user.image) res.end(user.image, "binary");
        else res.sendFile(path.join(__dirname, "../assets/images/user.jpeg"));
        break;
      }
      case CONSTANTS.COURSE: {
        const course = await Course.findOne({
          where: { id: Number(id) },
        });
        if (course.image) res.end(course.image, "binary");
        else res.sendFile(path.join(__dirname, "../assets/images/course.jpg"));
        break;
      }
      default:
        throw new Error(
          JSON.stringify({ errors: [{ message: "not valid owner or id" }] })
        );
    }
  } catch (ex) {
    console.log(ex);
    errorHandler(req, res, ex);
  }
}

module.exports = {
  getImage,
};
