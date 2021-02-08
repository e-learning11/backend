const router = require("express").Router();
const forumController = require("../controllers/forum_controller");
const authenticationModule = require("../utils/authentication");

router.get("/forum/questions", forumController.getQuestions);
router.get("/forum/questions/replies", forumController.getReplies);
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
  "/forum/vote",
  authenticationModule.checkAuth,
  forumController.postUpvote
);
module.exports = router;
