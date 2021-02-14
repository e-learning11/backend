// this the initial admin thought and what functions the admin should handel
/**
 * 1 - approve users
 * 2- approve courses
 * 3- delete course/user ???
 * 4- show webiste statistics : no of students/teachers/courses
 * 5- add admins
 */

const sequelize = require("../database/connection").sequelize;
const User = require("../models/user");
const Course = require("../models/courses");
const CourseSection = require("../models/course_section");
const CourseSectionComponent = require("../models/course_section_component");
const UserCourse = require("../models/user_course");
const errorHandler = require("../utils/error");
const CONSTANTS = require("../utils/const");
const Question = require("../models/question");
const Answer = require("../models/answer");
const Prequisite = require("../models/course_prequisite");
const UserTestGrade = require("../models/user_grades");
const CourseURL = require("../models/course_url");
const CourseAssignment = require("../models/course_assignment");
const CourseEssay = require("../models/course_essay");

/**
 * approveUser
 * @param {Request} req
 * @param {Response} res
 * approve or disapprove user
 */
async function approveUser(req, res) {
  try {
    const userId = req.user.id;
    const { id, approve } = req.body;
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    if (!user || user.type != CONSTANTS.ADMIN)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "user not admin" }],
        })
      );
    const userToBeApproved = await User.findOne({
      where: {
        id: Number(id),
      },
    });
    if (!userToBeApproved)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "user not found" }],
        })
      );
    userToBeApproved.approved = approve;
    await userToBeApproved.save();
    res.status(200).send(userToBeApproved).end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}
/**
 * approveCourse
 * @param {Request} req
 * @param {Response} res
 * approve or disapprove course
 */
async function approveCourse(req, res) {
  try {
    const userId = req.user.id;
    const { id, approve } = req.body;
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    if (!user || user.type != CONSTANTS.ADMIN)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "user not admin" }],
        })
      );
    const courseToBeApproved = await Course.findOne({
      where: {
        id: Number(id),
      },
    });
    if (!courseToBeApproved)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "course not found" }],
        })
      );
    courseToBeApproved.approved = approve;
    await courseToBeApproved.save();
    res.status(200).send(courseToBeApproved).end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}

async function getUserFullInfo(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.query;
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    if (!user || user.type != CONSTANTS.ADMIN)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "user not admin" }],
        })
      );
    const userFullInfo = await User.findOne({
      where: {
        id: Number(id),
      },
      attributes: [
        "id",
        "firstName",
        "lastName",
        "email",
        "phone",
        "type",
        "approved",
        "gender",
        "age",
      ],
      include: [
        {
          model: UserCourse,
          include: [
            {
              model: Course,
              attributes: [
                "id",
                "name",
                "summary",
                "description",
                "language",
                "date",
                "approved",
                "private",
                "gender",
                "ageMin",
                "ageMax",
              ],
              include: [
                {
                  model: CourseSection,
                  include: [
                    {
                      model: CourseSectionComponent,
                      attributes: [
                        "number",
                        "name",
                        "videoID",
                        "type",
                        "passingGrade",
                      ],
                      include: [
                        { model: Question, include: [{ model: Answer }] },
                      ],
                    },
                  ],
                },
                {
                  model: Prequisite,
                  as: "prequisites",
                  attributes: ["id"],
                },
              ],
            },
          ],
        },
        { model: UserTestGrade },
      ],
    });
    if (!userFullInfo)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "user not found" }],
        })
      );
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}

module.exports = {
  approveCourse,
  approveUser,
};
