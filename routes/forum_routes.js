const router = require("express").Router();
const forumController = require("../controllers/forum_controller");
const authenticationModule = require("../utils/authentication");
const middleware = require("../utils/middleware");
router.get(
  "/forum/questions",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  forumController.getQuestions
);
router.get(
  "/forum/questions/replies",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  forumController.getReplies
);
router.get("/forum/questions/replies/comments", forumController.getComments);
router.get("/forum/question/comments", forumController.getQuestionsComments);
router.post(
  "/forum/question",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  forumController.postQuestion
);

router.delete(
  "/forum/question",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  forumController.deleteQuestion
);

router.put(
  "/forum/question",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  forumController.editQuestion
);
router.post(
  "/forum/question/reply",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  forumController.postReply
);

router.put(
  "/forum/question/reply",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  forumController.editReply
);

router.delete(
  "/forum/question/reply",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  forumController.deleteReply
);
router.post(
  "/forum/question/reply/comment",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  forumController.postComment
);
router.post(
  "/forum/question/comment",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  forumController.postQuestionComment
);
router.put(
  "/forum/question/reply/comment",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  forumController.editComment
);
router.delete(
  "/forum/question/reply/comment",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  forumController.deleteComment
);
router.post(
  "/forum/vote",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  forumController.postUpvote
);
router.post(
  "/forum/question/reply/set-answer",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  forumController.setReplyAsAnswer
);
router.post(
  "/forum/question/set-question",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  forumController.makeQuestionFeatured
);

router.get(
  "/forum/vote",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  forumController.getUserVote
);
router.put(
  "/forum/question/comment",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  forumController.editQuestionComment
);

router.delete(
  "/forum/question/comment",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  forumController.deleteQuestionComment
);
router.delete(
  "/forum/question/reply/unset-answer",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  forumController.unsetReplyAsAnswer
);
module.exports = router;
