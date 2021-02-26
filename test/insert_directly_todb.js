const { createCourse } = require("./create_course");

const course1 = require("./courses/course1.json");
var mime = require("mime-types");
const path = require("path");
const fs = require("fs");
const contentType = mime.contentType(path.extname("./test.txt"));
const file = fs.readFileSync(
  "/mnt/CMP/projects/elearning-backend/test/test.txt"
);
const reqFile = {
  buffer: file,
  mimetype: contentType,
};

course1.date = Date.now();
const req = { files: { assignmentFile: [], vidoeFile: [] } }; //req.files["assignmentFile"],req.files["vidoeFile"]
for (let i = 0; i < course1.noOfAssignmentFiles; i++) {
  req.files.assignmentFile.push(reqFile);
}
for (let i = 0; i < course1.noOfVideoFiles; i++) {
  req.files.vidoeFile.push(reqFile);
}
const image = fs.readFileSync(course1.imagePath);
createCourse(1, course1, image, req);
