const router = require("express").Router();
const middleware = require("../utils/middleware");
const authenticationModule = require("../utils/authentication");
const adminController = require("../controllers/admin_controller");
const CourseController = require("../controllers/course_controller");
const multer = require("multer");
const upload = multer({
  fileFilter: (req, file, next) => {
    if (!file) next(null, true);
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
router.post(
  "/admin/approve/user",
  authenticationModule.checkAuth,
  middleware.checkUserAdmin,
  adminController.approveUser
);
router.post(
  "/admin/approve/course",
  authenticationModule.checkAuth,
  middleware.checkUserAdmin,
  adminController.approveCourse
);

router.delete(
  "/admin/course",
  authenticationModule.checkAuth,
  middleware.checkUserAdmin,
  adminController.approveDeleteCourse
);

router.delete(
  "/admin/user",
  authenticationModule.checkAuth,
  middleware.checkUserAdmin,
  adminController.deleteUser
);
router.post(
  "/admin/post",
  authenticationModule.checkAuth,
  middleware.checkUserAdmin,
  upload.single("image"),
  adminController.createNewsPost
);

router.put(
  "/admin/post",
  authenticationModule.checkAuth,
  middleware.checkUserAdmin,
  upload.single("image"),
  adminController.editNewsPost
);
router.delete(
  "/admin/post",
  authenticationModule.checkAuth,
  middleware.checkUserAdmin,
  adminController.deleteNewsPost
);

router.get(
  "/admin/users",
  authenticationModule.checkAuth,
  middleware.checkUserAdmin,
  adminController.getAllUsers
);
router.get(
  "/admin/requests",
  authenticationModule.checkAuth,
  middleware.checkUserAdmin,
  adminController.getAllRequests
);
router.get(
  "/admin/teacher/requests",
  authenticationModule.checkAuth,
  middleware.checkUserAdmin,
  adminController.getTeacherApprovalRequests
);
router.get(
  "/admin/course/approval/requests",
  authenticationModule.checkAuth,
  middleware.checkUserAdmin,
  adminController.getCourseApprovalRequests
);
router.get(
  "/admin/course/deletion/requests",
  authenticationModule.checkAuth,
  middleware.checkUserAdmin,
  adminController.getCourseDeletionRequests
);

router.delete(
  "/admin/user/approval",
  authenticationModule.checkAuth,
  middleware.checkUserAdmin,
  adminController.rejectUser
);
router.delete(
  "/admin/course/approval",
  authenticationModule.checkAuth,
  middleware.checkUserAdmin,
  adminController.rejectCoursecreation
);
router.delete(
  "/admin/course/deletion",
  authenticationModule.checkAuth,
  middleware.checkUserAdmin,
  adminController.rejectCourseDeletion
);
module.exports = router;
