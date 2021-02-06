const router = require("express").Router();
const imageController = require("../controllers/image_controller");

router.get("/image", imageController.getImage);

module.exports = router;
