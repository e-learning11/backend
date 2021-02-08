const User = require("../models/user");
const UserQuestions = require("../models/user_questions");
const UserQuestionsReplies = require("../models/user_question_replies");
const authenticationModule = require("../utils/authentication");
const errorHandler = require("../utils/error");

async function postQuestion(req, res) {
  try {
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}
