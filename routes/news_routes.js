const router = require("express").Router();
const newsContoller = require("../controllers/news_controller");

router.get("/news/posts", newsContoller.getNewsPost);
module.exports = router;
