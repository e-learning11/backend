const router = require("express").Router();
const userController = require("../controllers/user_controller");
const authenticationModule = require("../utils/authentication");

router.post("/login", userController.login);
router.post("/signup", userController.signup);
module.exports = router;
