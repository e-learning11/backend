const { createCourse, enrollUserInCourse } = require("./create_course");
const {
  postComment,
  postQuestion,
  postReply,
} = require("./create_forum_question");
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
const forum = require("./forums/forum1.json");
const users = [
  1,
  3,
  4,
  5,
  7,
  9,
  10,
  11,
  16,
  17,
  19,
  20,
  23,
  26,
  28,
  29,
  32,
  34,
  35,
  36,
  37,
  40,
  41,
  42,
  44,
];
const teachers = [2, 6, 8, 12];
const courses = [51, 52, 53, 62];
async function main() {
  for (let n = 1; n <= 4; n++) {
    try {
      const course = { id: courses[n - 1] };
      const enrolledUsers = users;
      //   for (let userId of users) {
      //     if (await enrollUserInCourse(course.id, userId))
      //       enrolledUsers.push(userId);
      //   }
      if (enrolledUsers.length != 0) {
        for (let question of forum.questions) {
          let userId =
            enrolledUsers[
              Math.floor((enrolledUsers.length - 1) * Math.random())
            ];
          console.log(userId);
          const q = await postQuestion(userId, {
            text: question.text,
            courseId: course.id,
            title: question.title,
            tags: question.tags,
          });
          if (q != -1) {
            for (let reply of question.replies) {
              let userId =
                enrolledUsers[Math.floor(enrolledUsers.length * Math.random())];
              let r = await postReply(userId, {
                questionId: q.id,
                text: reply.text,
              });
              if (r != -1) {
                for (let comment of reply.comments) {
                  let userId =
                    enrolledUsers[
                      Math.floor(enrolledUsers.length * Math.random())
                    ];
                  await postComment(userId, {
                    replyId: r.id,
                    text: comment.text,
                  });
                }
              }
            }
          }
        }
      }
    } catch (ex) {
      console.log(ex);
    }
  }
}

main();
