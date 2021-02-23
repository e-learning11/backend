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
const NewsPost = require("../models/news_post");
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
      attributes: ["id", "firstName", "lastName", "age", "type", "gender"],
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
      attributes: ["id", "firstName", "lastName", "age", "type", "gender"],
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
    console.log(ex);
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
      attributes: ["id", "firstName", "lastName", "age", "type", "gender"],
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
      attributes: ["id", "name", "summary"],
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
/**
 * getUserFullInfo
 * @param {Request} req
 * @param {Response} res
 */
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
/**
 *
 * @param {Request} req
 * @param {Response} res
 */
async function deleteUser(req, res) {
  try {
    const userId = Number(req.query.userId);
    await User.destroy({
      where: {
        id: userId,
      },
    });

    res.status(200).send("deleted user").end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}
/**
 * createNewsPost
 * @param {Request} req
 * @param {Response} res
 */
async function createNewsPost(req, res) {
  try {
    const userId = req.user.id;
    const { text, title } = req.body;
    let file = null;
    if (req.file) file = req.file.buffer;
    const newsPost = await NewsPost.create({
      title: title,
      text: text,
      image: file,
      UserId: userId,
    });
    newsPost.image = null;
    res.status(200).send(newsPost).end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}

/**
 * deleteNewsPost
 * @param {Request} req
 * @param {Response} res
 */
async function deleteNewsPost(req, res) {
  try {
    const userId = req.user.id;
    const { postId } = req.body;
    await NewsPost.destroy({
      where: { id: postId, UserId: userId },
    });
    res.status(200).send("deleted").end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}

/**
 * getAllUsers
 * @param {Request} req
 * @param {Response} res
 */
async function getAllUsers(req, res) {
  try {
    const limit = req.query.limit;
    const offset = req.query.offset;
    if (!offset)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "please add offset in query parameter" }],
        })
      );
    if (!limit)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "please add limit in query parameter" }],
        })
      );
    const where = {};
    const order = [];
    let sortOrder = "DESC";
    if (req.query.userId) where.id = Number(req.query.userId);
    if (
      req.query.type &&
      [CONSTANTS.ADMIN, CONSTANTS.TEACHER, CONSTANTS.STUDENT].includes(
        req.query.type
      )
    )
      where.type = req.query.type;
    if (req.query.sortOrder && ["ASC", "DESC"].includes(req.query.sortOrder))
      sortOrder = req.query.sortOrder;
    if (req.query.sort && ["createdAt", "age"].includes(req.query.sort))
      order.push([req.query.sort, sortOrder]);
    if (req.query.age) where.age = Number(req.query.age);
    if (req.query.gender) where.gender = Number(req.query.gender);
    if (req.query.email) where.email = req.query.email;
    if (req.query.firstName) where.firstName = req.query.firstName;
    if (req.query.lastName) where.lastName = req.query.lastName;
    if (req.query.approved)
      where.approved = req.query.approved == "true" ? true : false;
    const users = await User.findAll({
      where: where,
      limit: Number(limit),
      offset: Number(offset),
      order: order,
      attributes: [
        "id",
        "email",
        "firstName",
        "lastName",
        "age",
        "gender",
        "type",
        "phone",
        "createdAt",
        "approved",
      ],
    });
    res.status(200).send(users).end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}
module.exports = {
  approveCourse,
  approveUser,
  getUserFullInfo,
  deleteUser,
  createNewsPost,
  deleteNewsPost,
  getAllUsers,
};
