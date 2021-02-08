const router = require("express").Router();
const forumController = require("../controllers/forum_controller");
const authenticationModule = require("../utils/authentication");

router.get("/forum/questions", forumController.getQuestions);
router.post(
  "/forum/question",
  authenticationModule.checkAuth,
  forumController.postQuestion
);

module.exports = router;
