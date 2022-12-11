const sequelize = require('../database/connection').sequelize;
const { Op } = require("sequelize");
const User = require('../models/user');
const Course = require('../models/courses');
const CourseSection = require('../models/course_section');
const CourseSectionComponent = require('../models/course_section_component');
const UserCourse = require('../models/user_course');
const errorHandler = require('../utils/error');
const CONSTANTS = require('../utils/const');
const Question = require('../models/question');
const Answer = require('../models/answer');
const Prequisite = require('../models/course_prequisite');
const UserTestGrade = require('../models/user_grades');
const NewsPost = require('../models/news_post');
const UserQuestion = require('../models/user_questions');
const UserQuestionsReplies = require('../models/user_question_replies');
const UserVote = require('../models/user_votes');
const imageHelper = require('../utils/image');
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
      attributes: ['id', 'firstName', 'lastName', 'age', 'type', 'gender'],
    });
    if (!user || user.type != CONSTANTS.ADMIN)
      throw new Error(
        JSON.stringify({
          errors: [{ message: 'user not admin' }],
        }),
      );
    const userToBeApproved = await User.findOne({
      where: {
        id: Number(id),
      },
      attributes: ['id', 'firstName', 'lastName', 'age', 'type', 'gender'],
    });
    if (!userToBeApproved)
      throw new Error(
        JSON.stringify({
          errors: [{ message: 'user not found' }],
        }),
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
      attributes: ['id', 'firstName', 'lastName', 'age', 'type', 'gender'],
    });
    if (!user || user.type != CONSTANTS.ADMIN)
      throw new Error(
        JSON.stringify({
          errors: [{ message: 'user not admin' }],
        }),
      );
    const courseToBeApproved = await Course.findOne({
      where: {
        id: Number(id),
      },
      attributes: ['id', 'name', 'summary'],
    });
    if (!courseToBeApproved)
      throw new Error(
        JSON.stringify({
          errors: [{ message: 'course not found' }],
        }),
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
          errors: [{ message: 'user not admin' }],
        }),
      );
    const userFullInfo = await User.findOne({
      where: {
        id: Number(id),
      },
      attributes: [
        'id',
        'firstName',
        'lastName',
        'email',
        'phone',
        'type',
        'approved',
        'gender',
        'age',
      ],
      include: [
        {
          model: UserCourse,
          include: [
            {
              model: Course,
              attributes: [
                'id',
                'name',
                'summary',
                'description',
                'language',
                'date',
                'approved',
                'private',
                'gender',
                'ageMin',
                'ageMax',
              ],
              include: [
                {
                  model: CourseSection,
                  include: [
                    {
                      model: CourseSectionComponent,
                      attributes: [
                        'number',
                        'name',
                        'videoID',
                        'type',
                        'passingGrade',
                      ],
                      include: [
                        { model: Question, include: [{ model: Answer }] },
                      ],
                    },
                  ],
                },
                {
                  model: Prequisite,
                  as: 'prequisites',
                  attributes: ['id'],
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
          errors: [{ message: 'user not found' }],
        }),
      );
    res.status(200).send(userFullInfo).end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}
/**
 *deleteUser
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

    res.status(200).send('deleted user').end();
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
    file = await imageHelper.modifyImage(
      file,
      CONSTANTS.NEWS_POST_IMAGE_OPTIONS,
    );
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
    res.status(200).send('deleted').end();
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

    if (!offset || !limit) {
      const users = await User.findAll({
        where: {
          type: {
            [Op.ne]: CONSTANTS.ADMIN,
          },
        },
        attributes: [
          'email',
          'firstName',
          'lastName',
          'age',
          'gender',
          'type',
          'phone',
          'activated',
        ],
      });
      res.status(200).send(users).end();
    } else {
      const where = {};
      const order = [];
      let sortOrder = 'DESC';
      if (req.query.userId) where.id = Number(req.query.userId);
      if (
        req.query.type &&
        [CONSTANTS.ADMIN, CONSTANTS.TEACHER, CONSTANTS.STUDENT].includes(
          req.query.type,
        )
      )
        where.type = req.query.type;
      if (req.query.sortOrder && ['ASC', 'DESC'].includes(req.query.sortOrder))
        sortOrder = req.query.sortOrder;
      if (req.query.sort && ['createdAt', 'age'].includes(req.query.sort))
        order.push([req.query.sort, sortOrder]);
      if (req.query.age) where.age = Number(req.query.age);
      if (req.query.gender) where.gender = Number(req.query.gender);
      if (req.query.email) where.email = req.query.email;
      if (req.query.firstName) where.firstName = req.query.firstName;
      if (req.query.lastName) where.lastName = req.query.lastName;
      if (req.query.approved)
        where.approved = req.query.approved == 'true' ? true : false;
      const users = await User.findAll({
        where: where,
        limit: Number(limit),
        offset: Number(offset),
        order: order,
        attributes: [
          'email',
          'firstName',
          'lastName',
          'age',
          'gender',
          'type',
          'phone',
          'activated',
        ],
      });
      res.status(200).send(users).end();
    }
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}

/**
 *approveDeleteCourse
 * @param {Request} req
 * @param {Response} res
 *
 */
async function approveDeleteCourse(req, res) {
  const t = await sequelize.transaction();
  try {
    const { courseId } = req.query;

    if (!courseId)
      throw new Error(
        JSON.stringify({
          errors: [{ message: 'please add courseId as a query parameter' }],
        }),
      );
    const course = await Course.findOne({
      where: {
        id: Number(courseId),
      },
    });
    if (!course)
      throw new Error(
        JSON.stringify({
          errors: [{ message: 'no course with this id' }],
        }),
      );
    // delete all votes in the forum for this course
    const questions = await UserQuestion.findAll({
      where: {
        CourseId: courseId,
      },
    });
    for (let question of questions) {
      const replies = await UserQuestionsReplies.findAll({
        where: {
          UserQuestionId: question.id,
        },
      });
      // delete reply votes
      for (let reply of replies) {
        await UserVote.destroy({
          where: {
            type: CONSTANTS.FORUM_REPLY,
            typeId: reply.id,
          },
          transaction: t,
        });
      }
      // delete question vote
      await UserVote.destroy({
        where: {
          type: CONSTANTS.FORUM_QUESTION,
          typeId: question.id,
        },
        transaction: t,
      });
    }

    await Course.destroy({
      where: {
        id: Number(courseId),
      },
      transaction: t,
    });
    await t.commit();
    res.status(200).send('deleted successfully').end();
  } catch (ex) {
    await t.rollback();
    errorHandler(req, res, ex);
  }
}
/**
 * getAllRequests
 * @param {Request} req
 * @param {Response} res
 * get all requests that admin needs to approve to
 */
async function getAllRequests(req, res) {
  try {
    const { limitTeacher, offsetTeacher, limitCourse, offsetCourse } =
      req.query;
    if (!offsetTeacher)
      throw new Error(
        JSON.stringify({
          errors: [{ message: 'please add offsetTeacher in query parameter' }],
        }),
      );
    if (!limitTeacher)
      throw new Error(
        JSON.stringify({
          errors: [{ message: 'please add limitTeacher in query parameter' }],
        }),
      );
    if (!offsetCourse)
      throw new Error(
        JSON.stringify({
          errors: [{ message: 'please add offsetCourse in query parameter' }],
        }),
      );
    if (!limitCourse)
      throw new Error(
        JSON.stringify({
          errors: [{ message: 'please add limitCourse in query parameter' }],
        }),
      );
    const teacherApproval = await User.findAll({
      where: {
        approved: false,
        type: CONSTANTS.TEACHER,
      },
      attributes: ['id', 'age', 'firstName', 'lastName', 'gender', 'email'],

      limit: Number(limitTeacher),
      offset: Number(offsetTeacher),
    });
    const coursesApproval = await Course.findAll({
      where: {
        approved: false,
      },
      attributes: ['id', 'name', 'summary'],

      limit: Number(limitCourse),
      offset: Number(offsetCourse),
    });

    const courseDeleteion = await Course.findAll({
      where: {
        deleteRequest: true,
      },
      attributes: ['id', 'name', 'summary'],
      limit: Number(limitCourse),
      offset: Number(offsetCourse),
    });
    res
      .status(200)
      .send({
        teachersApproval: teacherApproval,
        courseApproval: coursesApproval,
        courseDeletion: courseDeleteion,
      })
      .end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}
/**
 * getTeacherApprovalRequests
 * @param {Request} req
 * @param {Response} res
 */
async function getTeacherApprovalRequests(req, res) {
  try {
    const { limit, offset } = req.query;
    if (!limit)
      throw new Error(
        JSON.stringify({
          errors: [{ message: 'please add limit in query parameter' }],
        }),
      );
    if (!offset)
      throw new Error(
        JSON.stringify({
          errors: [{ message: 'please add offset in query parameter' }],
        }),
      );

    const teacherApproval = await User.findAll({
      where: {
        approved: false,
        type: CONSTANTS.TEACHER,
      },
      attributes: ['id', 'age', 'firstName', 'lastName', 'gender', 'email'],

      limit: Number(limit),
      offset: Number(offset),
    });

    res.status(200).send(teacherApproval).end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}
/**
 * getCourseApprovalRequests
 * @param {Request} req
 * @param {Response} res
 */
async function getCourseApprovalRequests(req, res) {
  try {
    const { limit, offset } = req.query;
    if (!limit)
      throw new Error(
        JSON.stringify({
          errors: [{ message: 'please add limit in query parameter' }],
        }),
      );
    if (!offset)
      throw new Error(
        JSON.stringify({
          errors: [{ message: 'please add offset in query parameter' }],
        }),
      );

    const coursesApproval = await Course.findAll({
      where: {
        approved: false,
      },
      attributes: ['id', 'name', 'summary'],

      limit: Number(limit),
      offset: Number(offset),
    });

    res.status(200).send(coursesApproval).end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}
/**
 * getCourseDeletionRequests
 * @param {Request} req
 * @param {Response} res
 */
async function getCourseDeletionRequests(req, res) {
  try {
    const { limit, offset } = req.query;
    if (!limit)
      throw new Error(
        JSON.stringify({
          errors: [{ message: 'please add limit in query parameter' }],
        }),
      );
    if (!offset)
      throw new Error(
        JSON.stringify({
          errors: [{ message: 'please add offset in query parameter' }],
        }),
      );

    const coursesDeletion = await Course.findAll({
      where: {
        deleteRequest: true,
      },
      attributes: ['id', 'name', 'summary'],

      limit: Number(limit),
      offset: Number(offset),
    });

    res.status(200).send(coursesDeletion).end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}
/**
 * rejectUser
 * @param {Request} req
 * @param {Response} res
 */
async function rejectUser(req, res) {
  try {
    const { userId } = req.body;
    if (!userId)
      throw new Error(
        JSON.stringify({
          errors: [{ message: 'please add userId in body parameter' }],
        }),
      );
    await User.destroy({
      where: {
        id: Number(userId),
      },
    });
    res.status(200).send('user rejected from website successfully');
  } catch (ex) {
    console.log(ex);
    errorHandler(req, res, ex);
  }
}

/**
 * rejectCourse
 * @param {Request} req
 * @param {Response} res
 */
async function rejectCoursecreation(req, res) {
  try {
    const { courseId } = req.body;
    if (!courseId)
      throw new Error(
        JSON.stringify({
          errors: [{ message: 'please add courseId in body parameter' }],
        }),
      );
    await Course.destroy({
      where: {
        id: Number(courseId),
      },
    });
    res.status(200).send('course rejected from website successfully');
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}
/**
 * rejectCourseDeletion
 * @param {Request} req
 * @param {Response} res
 */
async function rejectCourseDeletion(req, res) {
  try {
    const { courseId } = req.body;
    if (!courseId)
      throw new Error(
        JSON.stringify({
          errors: [{ message: 'please add courseId in body parameter' }],
        }),
      );
    const course = await Course.findOne({
      where: {
        id: Number(courseId),
      },
    });
    if (!course)
      throw new Error(
        JSON.stringify({
          errors: [{ message: 'please add courseId in body parameter' }],
        }),
      );
    course.deleteRequest = false;
    await course.save();
    res.status(200).send('request to delete course was rejected successfully');
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}
/**
 * editNewsPost
 * @param {Request} req
 * @param {Response} res
 */
async function editNewsPost(req, res) {
  try {
    const { postId, text, title } = req.body;
    if (!postId)
      throw new Error(
        JSON.stringify({
          errors: [{ message: 'please add postId in body parameter' }],
        }),
      );
    const newsPost = await NewsPost.findOne({
      where: {
        id: postId,
      },
    });
    let file = req?.file?.buffer;
    file = await imageHelper.modifyImage(
      file,
      CONSTANTS.NEWS_POST_IMAGE_OPTIONS,
    );
    newsPost.text = text || newsPost.text;
    newsPost.title = title || newsPost.title;
    newsPost.image = file || newsPost.image;
    await newsPost.save();
    newsPost.image = null;
    res.status(200).send(newsPost).end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}

/**
 * getCertificates
 * @param {Request} req
 * @param {Response} res
 */
async function getCertificates(req, res) {
  try {
    const count = await UserCourse.count({
      where: { type: CONSTANTS.FINISHED },
    });

    const certificates = await UserCourse.findAll({
      where: { type: CONSTANTS.FINISHED },
      include: [
        {
          model: User,
          attributes: ['firstName', 'lastName', 'email'],
        },
        { model: Course, attributes: ['name'] },
      ],
    });

    const stats = {
      count,
      certificates,
    };
    res.status(200).send(stats).end();
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
  approveDeleteCourse,
  getAllRequests,
  getTeacherApprovalRequests,
  getCourseApprovalRequests,
  getCourseDeletionRequests,
  rejectUser,
  rejectCourseDeletion,
  rejectCoursecreation,
  editNewsPost,
  getCertificates,
};
