const router = require("express").Router();
const middleware = require("../utils/middleware");
const authenticationModule = require("../utils/authentication");
const adminController = require("../controllers/admin_controller");
const CourseController = require("../controllers/course_controller");
const multer = require("multer");
const upload = multer({
  fileFilter: (req, file, next) => {
    if (!file) next(null, true);
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      next(null, true);
    } else {
      next(null, false);
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
  CourseController.deleteCourse
);

router.delete(
  "/admin/user",
  authenticationModule.checkAuth,
  middleware.checkUserAdmin,
  adminController.deleteUser
);
module.exports = router;
