const { route } = require("./course_routes");

const router = require("express").Router();
const middleware = require("../utils/middleware");
const authenticationModule = require("../utils/authentication");
const adminController = require("../controllers/admin_controller");
const CourseController = require("../controllers/course_controller");
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
  CourseController.deleteCourse
);

router.delete(
  "/admin/user",
  authenticationModule.checkAuth,
  middleware.checkUserAdmin,
  adminController.deleteUser
);
module.exports = router;
