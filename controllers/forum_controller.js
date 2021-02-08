const User = require("../models/user");
const UserQuestions = require("../models/user_questions");
const UserQuestionsReplies = require("../models/user_question_replies");
const errorHandler = require("../utils/error");
const CONSTANTS = require("../utils/const");
const UserVote = require("../models/user_votes");
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
    const { text, tags } = req.body;
    const question = await UserQuestions.create({
      UserId: userId,
      text: text,
      tags: tags,
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
    if (req.query.upvotes) where.upvotes = Number(req.query.upvotes);
    if (req.query.downvotes) where.downvotes = Number(req.query.downvotes);
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
 * reply to specific question
 */
async function getReplies(req, res) {
  try {
    const { limit, offset } = req.query;
    const where = {};
    if (req.query.replyId) where.id = Number(req.query.replyId);
    if (req.query.questionId)
      where.UserQuestionId = Number(req.query.questionId);
    if (req.query.responderId) where.UserId = Number(req.query.responderId);
    if (req.query.upvotes) where.upvotes = Number(req.query.upvotes);
    if (req.query.downvotes) where.downvotes = Number(req.query.downvotes);
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
 * add upvote for a question or reply
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
        "cannot vote for this type again as you have already voted"
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
          upvotes: noOfUpvotes,
          downvotes: noOfDownvotes,
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
          upvotes: noOfUpvotes,
          downvotes: noOfDownvotes,
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
    await t.rollback();
    console.log(ex);
    errorHandler(req, res, ex);
  }
}
module.exports = {
  getQuestions,
  postQuestion,
  postReply,
  getReplies,
  postUpvote,
};
