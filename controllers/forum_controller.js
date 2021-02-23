const User = require("../models/user");
const UserQuestions = require("../models/user_questions");
const UserQuestionsReplies = require("../models/user_question_replies");
const errorHandler = require("../utils/error");
const CONSTANTS = require("../utils/const");
const UserVote = require("../models/user_votes");
const UserQuestionsRepliesComment = require("../models/user_questions_reply_comment");
const sequelize = require("../database/connection").sequelize;
const Sequelize = require("sequelize");
const UserCourse = require("../models/user_course");
const UserQuestionsComment = require("../models/user_questions_comments");
/**
 * postQuestion
 * @param {Request} req
 * @param {Response} res
 * user post question in forum
 */
async function postQuestion(req, res) {
  try {
    const userId = req.user.id;
    const { text, tags, courseId, title } = req.body;
    const question = await UserQuestions.create({
      UserId: userId,
      text: text,
      tags: tags,
      CourseId: Number(courseId),
      title: title,
    });
    res.status(200).send(question).end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}

/**
 * getQuestions
 * @param {Request} req
 * @param {Response} res
 * get question or questions based on filter
 */
async function getQuestions(req, res) {
  try {
    const userId = req.user.id;
    const { limit, offset } = req.query;
    const where = {};
    const order = [["isFeatured", "DESC"]];
    let sortOrder = "DESC";
    let filterKey = null;
    let isAnswered = null;
    if (req.query.questionId) where.id = Number(req.query.questionId);
    if (req.query.askerId) where.UserId = Number(req.query.askerId);
    if (req.query.votes) where.votes = Number(req.query.votes);
    if (req.query.courseId) where.CourseId = Number(req.query.courseId);
    if (req.query.isAnswered) {
      filterKey = true;
      isAnswered = req.query.isAnswered == "true" ? true : false;
    }
    if (req.query.isFeatured)
      where.isFeatured = req.query.isFeatured == "true" ? true : false;
    if (req.query.sortOrder && ["DESC", "ASC"].includes(req.query.sortOrder))
      sortOrder = req.query.sortOrder;
    if (req.query.tag)
      where.tags = {
        [Sequelize.Op.like]: `%${req.query.tag}%`,
      };
    if (
      req.query.sort &&
      CONSTANTS.FORUM_QUESTIONS_SORT_PARAMETERS.includes(req.query.sort)
    )
      order.push([req.query.sort, sortOrder]);
    if (req.query.title)
      where.title = {
        [Sequelize.Op.like]: `%${req.query.title}%`,
      };
    const whereReplies = {};
    if (req.query.isAcceptedAnswer)
      whereReplies.isAnswer =
        req.query.isAcceptedAnswer == "true" ? true : false;
    const questions = await UserQuestions.findAll({
      where: where,
      order: order,
      limit: Number(limit),
      offset: Number(offset),
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "age", "type"],
        },
        { model: UserQuestionsReplies },
      ],
      attributes: [
        "title",
        "text",
        "id",
        "tags",
        "votes",
        "UserId",
        "createdAt",
        "isFeatured",
      ],
    });
    let questionToSendBack = [];
    for (let question of questions) {
      let tempQ = question.get();
      tempQ.noOfAnswers = tempQ.UserQuestionsReplies.length;
      let isAcceptedAnswer = false;
      for (let reply of question.UserQuestionsReplies)
        if (reply.isAnswer) isAcceptedAnswer = true;
      const userVote = await UserVote.findOne({
        where: {
          type: CONSTANTS.FORUM_QUESTION,
          UserId: userId,
          typeId: Number(question.id),
        },
      });
      if (!userVote) tempQ.userVote = 0;
      else if (userVote.vote == CONSTANTS.FORUM_DOWNVOTE) tempQ.userVote = -1;
      else tempQ.userVote = 1;
      delete tempQ.UserQuestionsReplies;
      tempQ.isAcceptedAnswer = isAcceptedAnswer;
      questionToSendBack.push(tempQ);
    }
    // may need to filter or sort the array
    // questionToSendBack.sort((a, b) => {
    //   if (a.noOfAnswers < b.noOfAnswers) return -1;
    //   return 1;
    // });
    if (filterKey) {
      if (isAnswered)
        questionToSendBack = questionToSendBack.filter(
          (obj) => obj.noOfAnswers > 0
        );
      else
        questionToSendBack = questionToSendBack.filter(
          (obj) => obj.noOfAnswers == 0
        );
    }
    res.status(200).send(questionToSendBack).end();
  } catch (ex) {
    console.log(ex);
    errorHandler(req, res, ex);
  }
}

/**
 * postReply
 * @param {Request} req
 * @param {Response} res
 * reply to specific question
 */
async function postReply(req, res) {
  try {
    const userId = req.user.id;
    const { questionId, text } = req.body;
    const reply = await UserQuestionsReplies.create({
      UserQuestionId: Number(questionId),
      text: text,
      UserId: userId,
      isAnswer: false,
    });
    res.status(200).send(reply).end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}

/**
 * getReplies
 * @param {Request} req
 * @param {Response} res
 * get reply to specific question
 */
async function getReplies(req, res) {
  try {
    const userId = req.user.id;
    const { limit, offset } = req.query;
    const where = {};
    if (req.query.replyId) where.id = Number(req.query.replyId);
    if (req.query.questionId)
      where.UserQuestionId = Number(req.query.questionId);
    if (req.query.responderId) where.UserId = Number(req.query.responderId);
    if (req.query.votes) where.upvotes = Number(req.query.votes);
    const replies = await UserQuestionsReplies.findAll({
      where: where,
      limit: Number(limit),
      offset: Number(offset),
      include: [
        {
          model: User,
          attributes: ["id", "type", "firstName", "lastName", "email"],
        },
      ],
    });
    let repliesToSendBack = [];

    for (let reply of replies) {
      const trempR = reply.get();
      const userVote = await UserVote.findOne({
        where: {
          type: CONSTANTS.FORUM_REPLY,
          UserId: userId,
          typeId: Number(reply.id),
        },
      });
      if (!userVote) trempR.userVote = 0;
      else if (userVote.vote == CONSTANTS.FORUM_DOWNVOTE) trempR.userVote = -1;
      else trempR.userVote = 1;
      repliesToSendBack.push(trempR);
    }
    res.status(200).send(repliesToSendBack).end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}

/**
 * postUpvote
 * @param {Request} req
 * @param {Response} res
 * add upvote/downvote for a question or reply
 */
async function postUpvote(req, res) {
  const t = await sequelize.transaction();
  try {
    const userId = req.user.id;
    let { type, typeId, vote } = req.body;
    typeId = Number(typeId);
    // check if user has voted this vote before
    const userVote = await UserVote.findOne({
      where: {
        UserId: userId,
        type: type,
        vote: vote,
        typeId: typeId,
      },
    });
    if (userVote)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "cannot vote twice" }],
        })
      );
    // check if upvoted and there is downvote then remove downvote and vice versa
    if (vote == CONSTANTS.FORUM_UPVOTE) {
      const votedBefore = await UserVote.findOne({
        where: {
          UserId: userId,
          type: type,
          vote: CONSTANTS.FORUM_DOWNVOTE,
          typeId: typeId,
        },
      });
      if (votedBefore)
        await UserVote.destroy({
          where: {
            id: votedBefore.id,
          },
          transaction: t,
        });
      // add vote
      else
        await UserVote.create(
          {
            UserId: userId,
            type: type,
            vote: vote,
            typeId: typeId,
          },
          { transaction: t }
        );
    } else {
      const votedBefore = await UserVote.findOne({
        where: {
          UserId: userId,
          type: type,
          vote: CONSTANTS.FORUM_UPVOTE,
          typeId: typeId,
        },
      });
      if (votedBefore)
        await UserVote.destroy({
          where: {
            id: votedBefore.id,
          },
          transaction: t,
        });
      // add vote
      else
        await UserVote.create(
          {
            UserId: userId,
            type: type,
            vote: vote,
            typeId: typeId,
          },
          { transaction: t }
        );
    }
    await t.commit();
    try {
      // update up/down votes for entity
      const noOfUpvotes = await UserVote.count({
        where: {
          type: type,
          typeId: typeId,
          vote: CONSTANTS.FORUM_UPVOTE,
        },
      });
      const noOfDownvotes = await UserVote.count({
        where: {
          type: type,
          typeId: typeId,
          vote: CONSTANTS.FORUM_DOWNVOTE,
        },
      });
      if (type == CONSTANTS.FORUM_QUESTION) {
        await UserQuestions.update(
          {
            votes: noOfUpvotes - noOfDownvotes,
          },
          {
            where: {
              id: typeId,
            },
          }
        );
      } else {
        await UserQuestionsReplies.update(
          {
            votes: noOfUpvotes - noOfDownvotes,
          },
          {
            where: {
              id: typeId,
            },
          }
        );
      }

      res
        .status(200)
        .json({ upvotes: noOfUpvotes, downvotes: noOfDownvotes })
        .end();
    } catch (ex) {
      errorHandler(req, res, ex);
    }
  } catch (ex) {
    await t.rollback();
    console.log(ex);
    errorHandler(req, res, ex);
  }
}

/**
 * postComment
 * @param {Request} req
 * @param {Response} res
 * comment to specific reply
 */
async function postComment(req, res) {
  try {
    const userId = req.user.id;
    const { replyId, text } = req.body;
    // check reply exist
    const reply = await UserQuestionsReplies.findOne({
      where: {
        id: Number(replyId),
      },
    });
    if (!reply)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "no reply found with this id" }],
        })
      );
    const comment = await UserQuestionsRepliesComment.create({
      UserQuestionsReplyId: Number(replyId),
      text: text,
      UserId: userId,
    });
    res.status(200).send(comment).end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}

/**
 * getComments
 * @param {Request} req
 * @param {Response} res
 * get comment to specific reply
 */
async function getComments(req, res) {
  try {
    const { limit, offset, replyId } = req.query;

    const comments = await UserQuestionsRepliesComment.findAll({
      where: {
        UserQuestionsReplyId: Number(replyId),
      },
      limit: Number(limit),
      offset: Number(offset),
      include: [
        {
          model: User,
          attributes: ["id", "type", "firstName", "lastName", "email"],
        },
      ],
    });
    res.status(200).send(comments).end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}

/**
 * postQuestionComment
 * @param {Request} req
 * @param {Response} res
 * comment to specific question
 */
async function postQuestionComment(req, res) {
  try {
    const userId = req.user.id;
    const { questionId, text } = req.body;
    // check reply exist
    const reply = await UserQuestions.findOne({
      where: {
        id: Number(questionId),
      },
    });
    if (!reply)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "no question found with this id" }],
        })
      );
    // check that commented user is enrolled in course ??
    const comment = await UserQuestionsComment.create({
      UserQuestionId: Number(questionId),
      text: text,
      UserId: userId,
    });
    res.status(200).send(comment).end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}

/**
/**
 * getQuestionsComments
 * @param {Request} req
 * @param {Response} res
 * get comment to specific qyestion
 */
async function getQuestionsComments(req, res) {
  try {
    const { limit, offset, questionId } = req.query;

    const comments = await UserQuestionsComment.findAll({
      where: {
        UserQuestionId: Number(questionId),
      },
      limit: Number(limit),
      offset: Number(offset),
      include: [
        {
          model: User,
          attributes: ["id", "type", "firstName", "lastName", "email"],
        },
      ],
    });
    res.status(200).send(comments).end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}

/**
 *setReplyAsAnswer
 * @param {Request} req
 * @param {Response} res
 */
async function setReplyAsAnswer(req, res) {
  try {
    const userId = req.user.id;
    const { questionId, replyId } = req.body;
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    // check that this question belong to this user
    const userQuestion = await UserQuestions.findOne({
      where: {
        id: Number(questionId),
        UserId: userId,
      },
    });
    if (!userQuestion && user.type != CONSTANTS.ADMIN)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "not question owner" }],
        })
      );
    // check that no answer already marked for this question
    const replyAnswer = await UserQuestionsReplies.findOne({
      where: {
        isAnswer: true,
        UserQuestionId: Number(questionId),
      },
    });
    if (replyAnswer)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "there is already an answer for this question" }],
        })
      );
    // set reply to true ;
    const setToIsAnswer = await UserQuestionsReplies.update(
      {
        isAnswer: true,
      },
      {
        where: {
          id: Number(replyId),
          UserQuestionId: Number(questionId),
        },
      }
    );
    if (setToIsAnswer[0] == 1)
      res.status(200).send("set reply to answer successfully").end();
    else
      throw new Error(
        JSON.stringify({
          errors: [{ message: "cannot set this reply to answer" }],
        })
      );
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}
/**
 * makeQuestionFeatured
 * @param {Request} req
 * @param {Response} res
 * change question feature status
 */
async function makeQuestionFeatured(req, res) {
  try {
    const userId = req.user.id;
    const { questionId, courseId, isFeatured } = req.body;
    // check that user is teacher
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    if (user.type != CONSTANTS.TEACHER && user.type != CONSTANTS.ADMIN)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "user is not a teacher" }],
        })
      );
    // check user owns course
    const course = await UserCourse.findOne({
      where: {
        UserId: userId,
        CourseId: Number(courseId),
        type: CONSTANTS.CREATED,
      },
    });
    if (!course && user.type != CONSTANTS.ADMIN)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "user is not the owner for the course" }],
        })
      );
    // set question to featured
    await UserQuestions.update(
      {
        isFeatured: isFeatured,
      },
      {
        where: {
          id: Number(questionId),
        },
      }
    );
    res.status(200).send("updated question status").end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}
/**
 *deleteQuestion
 * @param {Request} req
 * @param {Response} res
 */
async function deleteQuestion(req, res) {
  try {
    const userId = req.user.id;
    const { questionId } = req.query;
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    if (!questionId)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "please add questionId to query paramaters" }],
        })
      );
    // check that this question belongs to user
    const question = await UserQuestions.findOne({
      where: {
        id: Number(questionId),
      },
    });
    if (!question)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "no question with this id " }],
        })
      );
    // check if this is the teacher
    const courseId = question.CourseId;
    const userCourse = await UserCourse.findOne({
      where: {
        UserId: userId,
        CourseId: courseId,
        type: CONSTANTS.CREATED,
      },
    });
    if (
      question.UserId != userId &&
      user.type != CONSTANTS.ADMIN &&
      !userCourse
    )
      throw new Error(
        JSON.stringify({
          errors: [{ message: "user is not owner of question" }],
        })
      );

    await UserQuestions.destroy({
      where: {
        id: Number(questionId),
      },
    });
    res.status(200).send("deleted successfully").end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}

/**
 *deleteReply
 * @param {Request} req
 * @param {Response} res
 */
async function deleteReply(req, res) {
  try {
    const userId = req.user.id;
    const { replyId } = req.query;
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    if (!replyId)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "please add replyId to query paramaters" }],
        })
      );
    // check that this reply belongs to user
    const reply = await UserQuestionsReplies.findOne({
      where: {
        id: Number(replyId),
      },
      include: [{ model: UserQuestions }],
    });
    if (!reply)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "no reply with this id " }],
        })
      );
    // check if this is the teacher
    const courseId = reply.UserQuestion.CourseId;
    const userCourse = await UserCourse.findOne({
      where: {
        UserId: userId,
        CourseId: courseId,
        type: CONSTANTS.CREATED,
      },
    });
    if (reply.UserId != userId && user.type != CONSTANTS.ADMIN && !userCourse)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "user is not owner of reply" }],
        })
      );
    await UserQuestionsReplies.destroy({
      where: {
        id: Number(replyId),
      },
    });
    res.status(200).send("deleted successfully").end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}

/**
 * deleteComment
 * @param {Request} req
 * @param {Response} res
 */
async function deleteComment(req, res) {
  try {
    const userId = req.user.id;
    const { commentId } = req.query;
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    if (!commentId)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "please add commentId to query paramaters" }],
        })
      );
    // check that this comment belongs to user
    const comment = await UserQuestionsRepliesComment.findOne({
      where: {
        id: Number(commentId),
      },
      include: [
        { model: UserQuestionsReplies, include: [{ model: UserQuestions }] },
      ],
    });
    if (!comment)
      throw new Error(
        JSON.stringify({
          errors: [
            { message: "no comment with this id or user doesnt own comment" },
          ],
        })
      );
    // check if this is the teacher
    const courseId = comment.UserQuestionsReply.UserQuestion.CourseId;
    const userCourse = await UserCourse.findOne({
      where: {
        UserId: userId,
        CourseId: courseId,
        type: CONSTANTS.CREATED,
      },
    });
    if (comment.UserId != userId && user.type != CONSTANTS.ADMIN && !userCourse)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "user is not owner of comment" }],
        })
      );
    await UserQuestionsRepliesComment.destroy({
      where: {
        id: Number(commentId),
      },
    });
    res.status(200).send("deleted successfully").end();
  } catch (ex) {
    console.log(ex);
    errorHandler(req, res, ex);
  }
}
/**
 * deleteQuestionComment
 * @param {Request} req
 * @param {Response} res
 */
async function deleteQuestionComment(req, res) {
  try {
    const userId = req.user.id;
    const { commentId } = req.query;
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    if (!commentId)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "please add commentId to query paramaters" }],
        })
      );
    // check that this comment belongs to user
    const comment = await UserQuestionsComment.findOne({
      where: {
        id: Number(commentId),
      },
      include: [{ model: UserQuestions }],
    });
    if (!comment)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "no comment with this id" }],
        })
      );
    // check if this is the teacher
    const courseId = comment.UserQuestion.CourseId;
    const userCourse = await UserCourse.findOne({
      where: {
        UserId: userId,
        CourseId: courseId,
        type: CONSTANTS.CREATED,
      },
    });
    if (comment.UserId != userId && user.type != CONSTANTS.ADMIN && !userCourse)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "user is not owner of comment" }],
        })
      );
    await UserQuestionsComment.destroy({
      where: {
        id: Number(commentId),
      },
    });
    res.status(200).send("deleted successfully").end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}

/**
 * editQuestion
 * @param {Request} req
 * @param {Response} res
 */
async function editQuestion(req, res) {
  try {
    const userId = req.user.id;
    const { questionId, text, tags, title } = req.body;
    if (!questionId)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "please add questionId to body paramaters" }],
        })
      );
    // check that this question belongs to user
    const question = await UserQuestions.findOne({
      where: {
        id: Number(questionId),
        UserId: userId,
      },
    });
    if (!question)
      throw new Error(
        JSON.stringify({
          errors: [
            { message: "no question with this id or user doesnt own question" },
          ],
        })
      );

    question.title = title || question.title;
    question.tags = tags || question.tags;
    question.text = text || question.text;
    await question.save();
    res.status(200).send(question).end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}

/**
 * editReply
 * @param {Request} req
 * @param {Response} res
 */
async function editReply(req, res) {
  try {
    const userId = req.user.id;
    const { replyId, text } = req.body;
    if (!replyId)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "please add replyId to body paramaters" }],
        })
      );
    // check that this question belongs to user
    const reply = await UserQuestionsReplies.findOne({
      where: {
        id: Number(replyId),
        UserId: userId,
      },
    });
    if (!reply)
      throw new Error(
        JSON.stringify({
          errors: [
            { message: "no reply with this id or user doesnt own reply" },
          ],
        })
      );

    reply.text = text || reply.text;
    await reply.save();
    res.status(200).send(reply).end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}

/**
 * editComment
 * @param {Request} req
 * @param {Response} res
 */
async function editComment(req, res) {
  try {
    const userId = req.user.id;
    const { commentId, text } = req.body;
    if (!commentId)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "please add commentId to body paramaters" }],
        })
      );
    // check that this question belongs to user
    const comment = await UserQuestionsRepliesComment.findOne({
      where: {
        id: Number(commentId),
        UserId: userId,
      },
    });
    if (!comment)
      throw new Error(
        JSON.stringify({
          errors: [
            { message: "no comment with this id or user doesnt own comment" },
          ],
        })
      );

    comment.text = text || comment.text;
    await comment.save();
    res.status(200).send(comment).end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}

/**
 * editQuestionComment
 * @param {Request} req
 * @param {Response} res
 */
async function editQuestionComment(req, res) {
  try {
    const userId = req.user.id;
    const { commentId, text } = req.body;
    if (!commentId)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "please add commentId to body paramaters" }],
        })
      );
    // check that this question belongs to user
    const comment = await UserQuestionsComment.findOne({
      where: {
        id: Number(commentId),
        UserId: userId,
      },
    });
    if (!comment)
      throw new Error(
        JSON.stringify({
          errors: [
            { message: "no comment with this id or user doesnt own comment" },
          ],
        })
      );

    comment.text = text || comment.text;
    await comment.save();
    res.status(200).send(comment).end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}
/**
 * getUserVote
 * @param {Request} req
 * @param {Response} res
 */
async function getUserVote(req, res) {
  try {
    const userId = req.user.id;
    const { typeId, type } = req.query;
    const userVote = await UserVote.findOne({
      where: {
        type: type,
        UserId: userId,
        typeId: Number(typeId),
      },
    });
    if (!userVote) {
      res.status(200).send("0").end();
      return;
    }
    if (userVote.vote == CONSTANTS.FORUM_DOWNVOTE)
      res.status(200).send("-1").end();
    else res.status(200).send("1").end();
  } catch (ex) {
    console.log(ex);
    errorHandler(req, res, ex);
  }
}

/**
 *unsetReplyAsAnswer
 * @param {Request} req
 * @param {Response} res
 */
async function unsetReplyAsAnswer(req, res) {
  try {
    const userId = req.user.id;
    const { questionId, replyId } = req.body;
    // check that this question belong to this user
    const userQuestion = await UserQuestions.findOne({
      where: {
        id: Number(questionId),
        UserId: userId,
      },
    });
    if (!userQuestion)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "not question owner" }],
        })
      );

    // unset reply to true ;
    const unsetToIsAnswer = await UserQuestionsReplies.update(
      {
        isAnswer: false,
      },
      {
        where: {
          id: Number(replyId),
          UserQuestionId: Number(questionId),
        },
      }
    );
    if (unsetToIsAnswer[0] == 1)
      res.status(200).send("reply is now not an answer").end();
    else
      throw new Error(
        JSON.stringify({
          errors: [
            {
              message:
                "cannot remove this reply from answered as it may not be set originally ",
            },
          ],
        })
      );
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}
module.exports = {
  getQuestions,
  postQuestion,
  postReply,
  getReplies,
  postUpvote,
  postComment,
  getComments,
  setReplyAsAnswer,
  makeQuestionFeatured,
  deleteQuestion,
  deleteReply,
  deleteComment,
  editQuestion,
  editReply,
  editComment,
  getUserVote,
  postQuestionComment,
  getQuestionsComments,
  editQuestionComment,
  deleteQuestionComment,
  unsetReplyAsAnswer,
};
