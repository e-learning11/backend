if (process.env.NODE_ENV == "local") {
  require("dotenv").config({
    path: "./.env",
  });
} else {
  require("dotenv").config({
    path: "./.env1",
  });
}
const app = require("express")();
const http = require("http");
var cors = require("cors");
const server = http.createServer(app);
require("./database/connection").connectDB();
require("./database/association");
const bodyParser = require("body-parser");
const userRouter = require("./routes/user_router");
const courseRouter = require("./routes/course_routes");
const imageRouter = require("./routes/image_routes");
const forumRouter = require("./routes/forum_routes");
const adminRouter = require("./routes/admin_routes");
const newsRouter = require("./routes/news_routes");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("/api", userRouter);
app.use("/api", courseRouter);
app.use("/api", imageRouter);
app.use("/api", forumRouter);
app.use("/api", adminRouter);
app.use("/api", newsRouter);
require("./utils/add_admin")();

/////////
require("./test/insert_directly_todb");
///////
server.listen(process.env.PORT || 3000, () => {
  console.log(`application is running on port ${process.env.PORT || 3000}`);
});
