const User = require("../models/user");
const Course = require("../models/courses");
const CourseSection = require("../models/course_section");
const CourseSectionComponent = require("../models/course_section_component");
const UserCourse = require("../models/user_course");
const Question = require("../models/question");
const Answer = require("../models/answer");
const Prequisite = require("../models/course_prequisite");
const UserTestGrade = require("../models/user_grades");
const UserQuestions = require("../models/user_questions");
const UserQuestionsReplies = require("../models/user_question_replies");
const UserVote = require("../models/user_votes");
const UserQuestionsRepliesComment = require("../models/user_questions_reply_comment");
CourseSection.hasMany(CourseSectionComponent);
CourseSectionComponent.belongsTo(CourseSection);
Course.hasMany(CourseSection);
CourseSection.belongsTo(Course);

Question.hasMany(Answer);
Answer.belongsTo(Question);
CourseSectionComponent.hasMany(Question);
Question.belongsTo(CourseSectionComponent);

Course.belongsToMany(User, {
  through: UserCourse,
});
User.belongsToMany(Course, {
  through: UserCourse,
});
User.hasMany(UserCourse);
UserCourse.belongsTo(User);
Course.hasMany(UserCourse);
UserCourse.belongsTo(Course);

Course.belongsToMany(Course, {
  through: Prequisite,
  as: "prequisites",
});

UserQuestionsRepliesComment.belongsTo(User);
User.hasMany(UserQuestionsRepliesComment);

UserQuestionsReplies.hasMany(UserQuestionsRepliesComment);
UserQuestionsRepliesComment.belongsTo(UserQuestionsReplies);

UserQuestions.hasMany(UserQuestionsReplies);
UserQuestionsReplies.belongsTo(UserQuestions);

User.hasMany(UserQuestions);
UserQuestions.belongsTo(User);

User.hasMany(UserQuestionsReplies);
User.hasMany(UserVote);
Course.hasMany(UserQuestions);

User.hasMany(UserTestGrade);
