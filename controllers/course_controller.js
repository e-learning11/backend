const User = require("../models/user");
const Course = require("../models/courses");
const CourseSection = require("../models/course_section");
const CourseSectionComponent = require("../models/course_section_component");
const UserCourse = require("../models/user_course");
const errorHandler = require("../utils/error");
const CONSTANTS = require("../utils/const");
const { sum } = require("../models/user");
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
/**
 * getRandomCourses
 * @param {Request} req
 * @param {Response} res
 * get random courses
 */
async function getRandomCourses(req, res) {
  try {
    const count = Number(req.query.count);
    const courses = await Course.findAll({
      limit: count,
    });
    res.status(200).send(courses).end();
  } catch (ex) {
    console.log(ex);
    errorHandler(req, res, ex);
  }
}
/**
 * createCourse
 * @param {Request} req
 * @param {Response} res
 * teacher create course
 */
async function createCourse(req, res) {
  try {
    const userId = req.user.id;
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    if (user.type != CONSTANTS.TEACHER) throw new Error("not teacher");
    const {
      name,
      summary,
      description,
      instructor,
      prequisites,
      language,
      date,
      sections,
    } = req.body;
    let courseObj = await Course.create({
      name: name,
      summary: summary,
      description: description,
      language: language,
      date: date,
      image: req.file.buffer,
      approved: false,
    });
    for (let section of sections) {
      let sectionObj = await CourseSection.create({
        name: section.name,
        start: section.start,
        end: section.end,
        CourseId: courseObj.id,
      });
      for (let component of section.components) {
        await CourseSectionComponent.create({
          number: component.number,
          videoID: component.videoID,
          name: component.name,
          type: component.type,
          CourseSectionId: sectionObj.id,
        });
      }
    }
  } catch (ex) {
    console.log(ex);
    errorHandler(req, res, ex);
  }
}
module.exports = {
  getEnrolledCoursesByUser,
  getCoursesCreatedByuser,
  getRandomCourses,
  createCourse,
};
