require("dotenv").config();
const app = require("express")();
const http = require("http");
var cors = require("cors");
const server = http.createServer(app);
require("./database/connection").connectDB();
require("./database/association");
const bodyParser = require("body-parser");
const userRouter = require("./routes/user_router");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("/api", userRouter);
server.listen(process.env.PORT || 3000, () => {
  console.log(`application is running on port ${process.env.PORT || 3000}`);
});
