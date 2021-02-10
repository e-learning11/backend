const User = require("../models/user");
const UserQuestions = require("../models/user_questions");
const UserQuestionsReplies = require("../models/user_question_replies");
const errorHandler = require("../utils/error");
const CONSTANTS = require("../utils/const");
const UserVote = require("../models/user_votes");
const UserQuestionsRepliesComment = require("../models/user_questions_reply_comment");
const sequelize = require("../database/connection").sequelize;
/**
 * postQuestion
 * @param {Request} req
 * @param {Response} res
 * user post question in forum
 */
async function postQuestion(req, res) {
  try {
    const userId = req.user.id;
    const { text, tags, courseId } = req.body;
    const question = await UserQuestions.create({
      UserId: userId,
      text: text,
      tags: tags,
      CourseId: Number(courseId),
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
    const { limit, offset } = req.query;
    const where = {};
    if (req.query.questionId) where.id = Number(req.query.questionId);
    if (req.query.askerId) where.UserId = Number(req.query.askerId);
    if (req.query.votes) where.votes = Number(req.query.votes);
    if (req.query.courseId) where.CourseId = Number(req.query.courseId);
    const questions = await UserQuestions.findAll({
      where: where,
      limit: Number(limit),
      offset: Number(offset),
    });
    res.status(200).send(questions).end();
  } catch (ex) {
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
    });
    res.status(200).send(replies).end();
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
    });
    res.status(200).send(comments).end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
async function setReplyAsAnswer(req, res) {
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
    // check that no answer already marked for this question
    const replyAnswer = await UserQuestionsReplies.findOne({
      where: {
        id: Number(replyId),
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
module.exports = {
  getQuestions,
  postQuestion,
  postReply,
  getReplies,
  postUpvote,
  postComment,
  getComments,
  setReplyAsAnswer,
};
