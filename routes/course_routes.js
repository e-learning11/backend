const router = require("express").Router();
const CourseController = require("../controllers/course_controller");
const authenticationModule = require("../utils/authentication");
const multer = require("multer");
const middleware = require("../utils/middleware");
const upload = multer({
  fileFilter: (req, file, next) => {
    if (!file) next(null, true);
    else if (file.fieldname != "image") next(null, true);
    else if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      next(null, true);
    } else {
      return next(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});
router.get(
  "/courses/enrolled",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  CourseController.getEnrolledCoursesByUser
);
router.get(
  "/courses/created",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  CourseController.getCoursesCreatedByuser
);
router.get(
  "/courses/finished",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  CourseController.getFinishedCoursesByUser
);
router.get("/courses/random", CourseController.getRandomCourses);
router.post(
  "/course/create",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
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
  middleware.checkUserApproval,
  CourseController.getUserCourseState
);
router.post(
  "/course/enroll",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  CourseController.enrollUserInCourse
);
router.post(
  "/course/test/grade",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  CourseController.autoGradeTest
);
router.get("/courses", CourseController.getAllCourses);
router.get("/course/categories", CourseController.getAllCourseCategories);
router.post(
  "/course/mark-as-done",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  CourseController.markComponentAsDone
);
router.post(
  "/course/finish",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  CourseController.markCourseAsComplete
);
router.post(
  "/course/assignment/submit",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  upload.single("file"),
  CourseController.submitAssignmentAnswer
);

router.get(
  "/course/overview",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  CourseController.getCourseOverview
);
router.get(
  "/course/assignments/submits",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  CourseController.getCourseAssignmentsSubmits
);
router.post(
  "/course/assignment/grade",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  CourseController.gradeAssignmentSubmission
);

router.post(
  "/course/essay/submit",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  CourseController.submitEssayAnswer
);
router.get(
  "/course/essays/submits",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  CourseController.getCourseEssaysSubmits
);

router.post(
  "/course/essay/grade",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  CourseController.gradeEssaySubmission
);

router.put(
  "/course/edit",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  upload.single("image"),
  CourseController.editCourseBasicInfo
);

router.get(
  "/course/component/status",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  CourseController.getCompoentStatus
);

router.put(
  "/course/full-edit",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
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
  middleware.checkUserApproval,
  CourseController.getTestGrade
);
router.delete(
  "/course",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  CourseController.deleteCourse
);

router.get(
  "/course/test/state",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  CourseController.getTestState
);

router.get(
  "/course/assignment/state",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  CourseController.getAssignmentState
);

router.get(
  "/course/enrolled-users",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  CourseController.getCourseEnrolledUsers
);
router.post(
  "/course/assign/teacher",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  CourseController.assignTeacherToCourse
);

router.get(
  "/course/user/finished-components",
  authenticationModule.checkAuth,
  CourseController.getUserFinishedCourseComponents
);
module.exports = router;
