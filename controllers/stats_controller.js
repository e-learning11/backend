const User = require("../models/user");
const Course = require("../models/courses");
const CONSTANTS = require("../utils/const");
const errorHandler = require("../utils/error");
/**
 * getNewsPost
 * @param {Request} req
 * @param {Response} res
 */
async function getStats(req, res) {
  try {
    const courses = await Course.count();
    const teachers = await User.count({
      where: { type: CONSTANTS.TEACHER },
    });
    const students = await User.count({
      where: { type: CONSTANTS.STUDENT },
    });
    const stats = {
      courses,
      students,
      teachers
    };
    res.status(200).send(stats).end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}
module.exports = { getStats };
