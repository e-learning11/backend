const router = require("express").Router();
const userController = require("../controllers/user_controller");
const authenticationModule = require("../utils/authentication");
const multer = require("multer");
const upload = multer();

router.post("/login", userController.login);
router.post(
  "/signup",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "videoImages" },
    { name: "assignmentImages" },
  ]),
  userController.signup
);
router.get(
  "/user/profile",
  authenticationModule.checkAuth,
  userController.getProfile
);
router.put(
  "/user/profile/edit",
  authenticationModule.checkAuth,
  userController.editProfile
);
module.exports = router;
