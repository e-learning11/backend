const router = require("express").Router();
const userController = require("../controllers/user_controller");
const authenticationModule = require("../utils/authentication");
const multer = require("multer");
const middleware = require("../utils/middleware");
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
      return next(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

router.post("/login", userController.login);
router.post("/signup", upload.single("image"), userController.signup);
router.get(
  "/user/profile",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  userController.getProfile
);
router.put(
  "/user/profile/edit",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  upload.single("image"),
  userController.editProfile
);
router.delete(
  "/user",
  authenticationModule.checkAuth,
  middleware.checkUserApproval,
  userController.deleteUser
);
router.get("/user/public", userController.getPublicProfile);
router.get("/teachers", userController.getAllTeachers);

router.post("/user/forget-password", userController.forgetPassword);
router.post("/user/reset-password", userController.resetPassword);
module.exports = router;
