const User = require("../models/user");
const Course = require("../models/courses");
const CourseSection = require("../models/course_section");
const CourseSectionComponent = require("../models/course_section_component");
const UserCourse = require("../models/user_course");
const errorHandler = require("../utils/error");
const CONSTANTS = require("../utils/const");
/**
 * getEnrolledCoursesByUser
 * @param {Request} req
 * @param {Response} res
 * get courses that user enroll in
 */
async function getEnrolledCoursesByUser(req, res) {
  try {
    const userId = req.user.id;
    const userCourses = await Course.findAll({
      include: [
        {
          model: UserCourse,
          where: {
            UserId: userId,
            type: CONSTANTS.ENROLLED,
          },
        },
      ],
    });
    res.status(200).send(userCourses).end();
  } catch (ex) {
    console.log(ex);
    errorHandler(req, res, ex);
  }
}
/**
 * getCoursesCreatedByuser
 * @param {Request} req
 * @param {Response} res
 * get courses that teacher created
 */
async function getCoursesCreatedByuser(req, res) {
  try {
    const userId = req.user.id;
    const userCourses = await Course.findAll({
      include: [
        {
          model: UserCourse,
          where: {
            UserId: userId,
            type: CONSTANTS.CREATED,
          },
        },
      ],
    });
    res.status(200).send(userCourses).end();
  } catch (ex) {
    console.log(ex);
    errorHandler(req, res, ex);
  }
}
module.exports = {
  getEnrolledCoursesByUser,
  getCoursesCreatedByuser,
};
