const router = require("express").Router();
const userController = require("../controllers/user_controller");
const authenticationModule = require("../utils/authentication");
const multer = require("multer");
const upload = multer();

router.post("/login", userController.login);
router.post("/signup", upload.single("image"), userController.signup);
module.exports = router;
