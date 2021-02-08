const User = require("../models/user");
const UserQuestions = require("../models/user_questions");
const UserQuestionsReplies = require("../models/user_question_replies");
const authenticationModule = require("../utils/authentication");
const errorHandler = require("../utils/error");

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
module.exports = {
  getQuestions,
  postQuestion,
  postReply,
  getReplies,
};
