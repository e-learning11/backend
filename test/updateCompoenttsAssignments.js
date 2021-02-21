const CourseSectionComponent = require("../models/course_section_component");
var mime = require("mime-types");
const path = require("path");
const fs = require("fs");
const contentType = mime.contentType(path.extname("./test.txt"));
module.exports = async function () {
  console.log(contentType);
  const file = fs.readFileSync(
    "/mnt/CMP/projects/elearning-backend/test/test.txt"
  );
  const comps = await CourseSectionComponent.update(
    {
      file: file,
      contentType: contentType,
      hasFile: true,
    },
    {
      where: {
        type: "Assignment",
      },
    }
  );

  console.log(comps);
};
