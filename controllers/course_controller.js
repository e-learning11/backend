const User = require("../models/user");
const Course = require("../models/courses");
const CourseSection = require("../models/course_section");
const CourseSectionComponent = require("../models/course_section_component");
const UserCourse = require("../models/user_course");
const errorHandler = require("../utils/error");
const CONSTANTS = require("../utils/const");
const Question = require("../models/question");
const Answer = require("../models/answer");
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
      age,
      gender,
      private,
    } = JSON.parse(req.body.json);
    let courseObj = await Course.create({
      name: name,
      summary: summary,
      description: description,
      language: language,
      date: date,
      approved: false,
      age: age,
      gender: gender,
      image: req.file.buffer,
      private: private,
    });
    await UserCourse.create({
      CourseId: courseObj.id,
      UserId: userId,
      type: CONSTANTS.CREATED,
    });
    for (let section of sections) {
      let sectionObj = await CourseSection.create({
        name: section.name,
        start: section.start,
        end: section.end,
        CourseId: courseObj.id,
      });
      for (let component of section.components) {
        let courseSelectionComponentObj = await CourseSectionComponent.create({
          number: component.number,
          videoID: component.videoID,
          name: component.name,
          type: component.type,
          CourseSectionId: sectionObj.id,
        });
        if (component.test) {
          for (let question of component.test) {
            let questionObj = await Question.create({
              CourseSectionComponentId: courseSelectionComponentObj.id,
              Q: question.Q,
              type: question.type,
              correctAnswer: question.correctAnswer,
            });
            if (question.A) {
              for (let answer of question.A) {
                let answerObj = await Answer.create({
                  A: answer,
                  QuestionId: questionObj.id,
                });
              }
            }
          }
        }
      }
    }
    courseObj.image = null;
    res.status(200).send(courseObj).end();
  } catch (ex) {
    console.log(ex);
    errorHandler(req, res, ex);
  }
}
/**
 * getCourseFullInfo
 * @param {Request} req
 * @param {Response} res
 * get all information about course
 */
async function getCourseFullInfo(req, res) {
  try {
    const courseId = Number(req.query.courseId);
    const course = await Course.findOne({
      where: {
        id: courseId,
      },
      include: [
        {
          model: CourseSection,
          include: [
            {
              model: CourseSectionComponent,
              include: [{ model: Question, include: [{ model: Answer }] }],
            },
          ],
        },
      ],
    });
    course.image = null;
    res.status(200).send(course).end();
  } catch (ex) {
    console.log(ex);
    errorHandler(req, res, ex);
  }
}
/**
 * getUserCourseState
 * @param {Request} req
 * @param {Response} res
 * get user course state and info
 */
async function getUserCourseState(req, res) {
  try {
    const userId = await req.user.id;
    const courseId = Number(req.query.courseId);
    const course = await Course.findOne({
      include: [
        {
          model: UserCourse,
          where: {
            UserId: userId,
            type: CONSTANTS.ENROLLED,
            CourseId: courseId,
          },
        },
      ],
    });
    res.status(200).send(course).end();
  } catch (ex) {
    console.log(ex);
    errorHandler(req, res, ex);
  }
}

/**
 * enrollUserInCourse
 * @param {Request} req
 * @param {Response} res
 *enroll user in course
 */
async function enrollUserInCourse(req, res) {
  try {
    const userId = await req.user.id;
    const courseId = Number(req.query.courseId);
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    const course = await Course.findOne({
      where: {
        id: courseId,
      },
    });
    if (course.gender != CONSTANTS.BOTH && course.gender != user.gender)
      throw new Error("gender difference");
    const enrolledCourseState = await UserCourse.create({
      UserId: userId,
      CourseId: courseId,
      type: CONSTANTS.ENROLLED,

      currentComponent: 0,
    });
    res.status(200).send(enrolledCourseState).end();
  } catch (ex) {
    console.log(ex);
    errorHandler(req, res, ex);
  }
}
/**
 * autoGradeTest
 * @param {Request} req
 * @param {Response} res
 * auto grade MCQ and true and false tests and return the result as array of 1 for correct answers and 0 for wrong answers
 */
async function autoGradeTest(req, res) {
  try {
    const testId = Number(req.query.testId);
    const answers = req.body.answers;
    const results = [];
    const courseSectionComponent = await CourseSectionComponent.findOne({
      where: {
        id: testId,
      },
      include: [{ model: Question, include: [{ model: Answer }] }],
    });
    for (let [i, question] of courseSectionComponent.Questions.entries()) {
      if (question.correctAnswer == answers[i]) results.push(1);
      else results.push(0);
    }

    res.status(200).send(results).end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}
/**
 * getAllCourses
 * @param {Request} req
 * @param {Response} res
 * get all courses using pagnition for front and home page
 */
async function getAllCourses(req, res) {
  try {
    const { offset, limit } = req.query;
    // check for filters
    const where = {};
    if (req.query.language) where.language = req.query.language;
    if (req.query.name) where.name = req.query.name;
    if (req.query.date) where.date = req.query.date;
    if (req.query.gender) where.gender = Number(req.query.gender);
    if (req.query.age) where.gender = Number(req.query.age);
    const courses = await Course.findAll({
      where: where,
      limit: Number(limit),
      offset: Number(offset),
      include: [
        {
          model: UserCourse,
          where: {
            type: CONSTANTS.CREATED,
          },
        },
        {
          model: User,
        },
      ],
    });
    const coursesToSendBack = [];
    for (let course of courses) {
      coursesToSendBack.push({
        courseId: course.id,
        teacherId: course.Users[0].id,
        name: course.name,
        summary: course.summary,
        instructor: {
          firstName: course.Users[0].firstName,
          lastName: course.Users[0].lastName,
        },
      });
    }
    res.send(coursesToSendBack).end();
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
  getCourseFullInfo,
  getUserCourseState,
  enrollUserInCourse,
  autoGradeTest,
  getAllCourses,
};
