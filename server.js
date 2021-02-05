require("dotenv").config();
const app = require("express")();
const http = require("http");
var cors = require("cors");
const server = http.createServer(app);
require("./database/connection")();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
server.listen(process.env.PORT || 3000, () => {
  console.log(`application is running on port ${process.env.PORT || 3000}`);
});
