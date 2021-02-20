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
router.get(
  "/courses/finished",
  authenticationModule.checkAuth,
  CourseController.getFinishedCoursesByUser
);
router.get("/courses/random", CourseController.getRandomCourses);
router.post(
  "/course/create",
  authenticationModule.checkAuth,
  upload.fields([
    { name: "image" },
    { name: "vidoeFile" },
    { name: "assignmentFile" },
  ]),
  CourseController.createCourse
);
router.get("/course/get", CourseController.getCourseFullInfo);
router.get(
  "/course/user-state",
  authenticationModule.checkAuth,
  CourseController.getUserCourseState
);
router.post(
  "/course/enroll",
  authenticationModule.checkAuth,
  CourseController.enrollUserInCourse
);
router.post(
  "/course/test/grade",
  authenticationModule.checkAuth,
  CourseController.autoGradeTest
);
router.get("/courses", CourseController.getAllCourses);
router.post(
  "/course/mark-as-done",
  authenticationModule.checkAuth,
  CourseController.markComponentAsDone
);
router.post(
  "/course/finish",
  authenticationModule.checkAuth,
  CourseController.markCourseAsComplete
);
router.post(
  "/course/assignment/submit",
  authenticationModule.checkAuth,
  upload.single("file"),
  CourseController.submitAssignmentAnswer
);

router.get(
  "/course/overview",
  authenticationModule.checkAuth,
  CourseController.getCourseOverview
);
router.get(
  "/course/assignments/submits",
  authenticationModule.checkAuth,
  CourseController.getCourseAssignmentsSubmits
);
router.post(
  "/course/assignment/grade",
  authenticationModule.checkAuth,
  CourseController.gradeAssignmentSubmission
);

router.post(
  "/course/essay/submit",
  authenticationModule.checkAuth,
  CourseController.submitEssayAnswer
);
router.get(
  "/course/essays/submits",
  authenticationModule.checkAuth,
  CourseController.getCourseEssaysSubmits
);

router.post(
  "/course/essay/grade",
  authenticationModule.checkAuth,
  CourseController.gradeEssaySubmission
);

router.put(
  "/course/edit",
  authenticationModule.checkAuth,
  upload.single("image"),
  CourseController.editCourseBasicInfo
);

router.get(
  "/course/component/status",
  authenticationModule.checkAuth,
  CourseController.getCompoentStatus
);

router.put(
  "/course/full-edit",
  authenticationModule.checkAuth,
  upload.fields([
    { name: "image" },
    { name: "vidoeFile" },
    { name: "assignmentFile" },
  ]),
  CourseController.editFullCourse
);
router.get("/course/test/user-grade", CourseController.getUserAutoTestGrade);
router.get("/course/essay/user-grade", CourseController.getUserEssayGrade);
router.get("/course/component/file", CourseController.getComponentFile);
router.get(
  "/course/test/grade",
  authenticationModule.checkAuth,
  CourseController.getTestGrade
);
router.delete(
  "/course",
  authenticationModule.checkAuth,
  CourseController.deleteCourse
);

router.get(
  "/course/test/state",
  authenticationModule.checkAuth,
  CourseController.getTestState
);

router.get(
  "/course/assignment/state",
  authenticationModule.checkAuth,
  CourseController.getAssignmentState
);
module.exports = router;
