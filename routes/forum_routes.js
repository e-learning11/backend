const router = require("express").Router();
const forumController = require("../controllers/forum_controller");
const authenticationModule = require("../utils/authentication");

router.get(
  "/forum/questions",
  authenticationModule.checkAuth,
  forumController.getQuestions
);
router.get(
  "/forum/questions/replies",
  authenticationModule.checkAuth,
  forumController.getReplies
);
router.get("/forum/questions/replies/comments", forumController.getComments);
router.get("/forum/question/comments", forumController.getQuestionsComments);
router.post(
  "/forum/question",
  authenticationModule.checkAuth,
  forumController.postQuestion
);

router.delete(
  "/forum/question",
  authenticationModule.checkAuth,
  forumController.deleteQuestion
);

router.put(
  "/forum/question",
  authenticationModule.checkAuth,
  forumController.editQuestion
);
router.post(
  "/forum/question/reply",
  authenticationModule.checkAuth,
  forumController.postReply
);

router.put(
  "/forum/question/reply",
  authenticationModule.checkAuth,
  forumController.editReply
);

router.delete(
  "/forum/question/reply",
  authenticationModule.checkAuth,
  forumController.deleteReply
);
router.post(
  "/forum/question/reply/comment",
  authenticationModule.checkAuth,
  forumController.postComment
);
router.post(
  "/forum/question/comment",
  authenticationModule.checkAuth,
  forumController.postQuestionComment
);
router.put(
  "/forum/question/reply/comment",
  authenticationModule.checkAuth,
  forumController.editComment
);
router.delete(
  "/forum/question/reply/comment",
  authenticationModule.checkAuth,
  forumController.deleteComment
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
router.post(
  "/forum/question/set-question",
  authenticationModule.checkAuth,
  forumController.makeQuestionFeatured
);

router.get(
  "/forum/vote",
  authenticationModule.checkAuth,
  forumController.getUserVote
);
router.put(
  "/forum/question/comment",
  authenticationModule.checkAuth,
  forumController.editQuestionComment
);

router.delete(
  "/forum/question/comment",
  authenticationModule.checkAuth,
  forumController.deleteQuestionComment
);
router.delete(
  "/forum/question/reply/unset-answer",
  authenticationModule.checkAuth,
  forumController.unsetReplyAsAnswer
);
module.exports = router;
