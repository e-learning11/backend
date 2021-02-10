const router = require("express").Router();
const forumController = require("../controllers/forum_controller");
const authenticationModule = require("../utils/authentication");

router.get("/forum/questions", forumController.getQuestions);
router.get("/forum/questions/replies", forumController.getReplies);
router.get("/forum/questions/replies/comments", forumController.getComments);
router.post(
  "/forum/question",
  authenticationModule.checkAuth,
  forumController.postQuestion
);
router.post(
  "/forum/question/reply",
  authenticationModule.checkAuth,
  forumController.postReply
);
router.post(
  "/forum/question/reply/comment",
  authenticationModule.checkAuth,
  forumController.postComment
);
router.post(
  "/forum/vote",
  authenticationModule.checkAuth,
  forumController.postUpvote
);
router.post(
  "/forum/question/reply/set-answer",
  authenticationModule.checkAuth,
  forumController.setReplyAsAnswer
);
module.exports = router;
