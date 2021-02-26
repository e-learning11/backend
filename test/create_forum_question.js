const User = require("../models/user");
const UserQuestions = require("../models/user_questions");
const UserQuestionsReplies = require("../models/user_question_replies");
const CONSTANTS = require("../utils/const");
const UserQuestionsRepliesComment = require("../models/user_questions_reply_comment");
const Sequelize = require("sequelize");
const UserCourse = require("../models/user_course");
const UserQuestionsComment = require("../models/user_questions_comments");

async function postQuestion(userId, body) {
  try {
    const { text, tags, courseId, title } = body;
    // check that user is either teacher owner of course or admin or student enrolled in course
    const userEnrolled = await UserCourse.findOne({
      where: {
        [Sequelize.Op.or]: [
          { type: CONSTANTS.ENROLLED },
          { type: CONSTANTS.FINISHED },
          { type: CONSTANTS.CREATED },
        ],
      },
    });
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    if (!userEnrolled && user.type != CONSTANTS.ADMIN)
      throw new Error(
        JSON.stringify({
          errors: [
            {
              message:
                "user cannot post questions in this forumas he is not the owner teacher or not an enrolled student",
            },
          ],
        })
      );
    const question = await UserQuestions.create({
      UserId: userId,
      text: text,
      tags: tags,
      CourseId: Number(courseId),
      title: title,
    });
    console.log(question);
    return question;
  } catch (ex) {
    console.log(ex);
    return -1;
  }
}

async function postReply(userId, body) {
  try {
    const { questionId, text } = body;

    // check that user is either teacher owner of course or admin or student enrolled in course
    const userEnrolled = await UserCourse.findOne({
      where: {
        [Sequelize.Op.or]: [
          { type: CONSTANTS.ENROLLED },
          { type: CONSTANTS.FINISHED },
          { type: CONSTANTS.CREATED },
        ],
      },
    });
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    if (!userEnrolled && user.type != CONSTANTS.ADMIN)
      throw new Error(
        JSON.stringify({
          errors: [
            {
              message:
                "user cannot post questions in this forumas he is not the owner teacher or not an enrolled student",
            },
          ],
        })
      );

    const question = UserQuestions.findOne({
      where: {
        id: Number(questionId),
      },
    });
    if (!question)
      throw new Error(
        JSON.stringify({
          errors: [
            {
              message: "no question with this id",
            },
          ],
        })
      );
    const reply = await UserQuestionsReplies.create({
      UserQuestionId: Number(questionId),
      text: text,
      UserId: userId,
      isAnswer: false,
    });
    //console.log(reply);
    return reply;
  } catch (ex) {
    console.log(ex);
    return -1;
  }
}

async function postComment(userId, body) {
  try {
    const { replyId, text } = body;
    const userEnrolled = await UserCourse.findOne({
      where: {
        [Sequelize.Op.or]: [
          { type: CONSTANTS.ENROLLED },
          { type: CONSTANTS.FINISHED },
          { type: CONSTANTS.CREATED },
        ],
      },
    });
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    if (!userEnrolled && user.type != CONSTANTS.ADMIN)
      throw new Error(
        JSON.stringify({
          errors: [
            {
              message:
                "user cannot post questions in this forumas he is not the owner teacher or not an enrolled student",
            },
          ],
        })
      );
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
    //console.log(comment);
    return comment;
  } catch (ex) {
    console.log(ex);
    return -1;
  }
}

async function postQuestionComment(userId, body) {
  try {
    const { questionId, text } = body;
    const userEnrolled = await UserCourse.findOne({
      where: {
        [Sequelize.Op.or]: [
          { type: CONSTANTS.ENROLLED },
          { type: CONSTANTS.FINISHED },
          { type: CONSTANTS.CREATED },
        ],
      },
    });
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    if (!userEnrolled && user.type != CONSTANTS.ADMIN)
      throw new Error(
        JSON.stringify({
          errors: [
            {
              message:
                "user cannot post questions in this forumas he is not the owner teacher or not an enrolled student",
            },
          ],
        })
      );
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
    //console.log(comment);
    return comment;
  } catch (ex) {
    console.log(ex);
    return -1;
  }
}

module.exports = {
  postQuestion,
  postQuestionComment,
  postReply,
  postComment,
};
