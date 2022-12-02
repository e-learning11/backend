const router = require("express").Router();
const statsContoller = require("../controllers/stats_controller");

router.get("/stats/overview", statsContoller.getStats);
module.exports = router;
