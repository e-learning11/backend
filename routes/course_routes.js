const router = require("express").Router();
const CourseController = require("../controllers/course_controller");
const authenticationModule = require("../utils/authentication");
const multer = require("multer");
const upload = multer();

router.get(
  "/courses/enrolled",
  authenticationModule.checkAuth,
  CourseController.getEnrolledCoursesByUser
);
router.get(
  "/courses/created",
  authenticationModule.checkAuth,
  CourseController.getCoursesCreatedByuser
);
router.get("/courses/random", CourseController.getRandomCourses);
router.post(
  "/course/create",
  authenticationModule.checkAuth,
  upload.single("image"),
  CourseController.createCourse
);
router.get("/course/get", CourseController.getCourseFullInfo);
module.exports = router;
