const router = require("express").Router();
const CourseController = require("../controllers/course_controller");
const authenticationModule = require("../utils/authentication");

router.get(
  "/courses/enrolled",
  authenticationModule.checkAuth,
  CourseController.getEnrolledCoursesByUser
);
module.exports = router;
