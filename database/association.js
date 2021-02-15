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
const CourseURL = require("../models/course_url");
const CourseAssignment = require("../models/course_assignment");
const CourseEssay = require("../models/course_essay");
const UserCourseComponent = require("../models/user_course_component");
CourseSection.hasMany(CourseSectionComponent, { onDelete: "CASCADE" });
CourseSectionComponent.belongsTo(CourseSection);
Course.hasMany(CourseSection, { onDelete: "CASCADE" });
CourseSection.belongsTo(Course);

Question.hasMany(Answer, { onDelete: "CASCADE" });
Answer.belongsTo(Question);
CourseSectionComponent.hasMany(Question, { onDelete: "CASCADE" });
Question.belongsTo(CourseSectionComponent);

Course.belongsToMany(User, {
  through: UserCourse,
});
User.belongsToMany(Course, {
  through: UserCourse,
  onDelete: "CASCADE",
});
User.hasMany(UserCourse, { onDelete: "CASCADE" });
UserCourse.belongsTo(User);
Course.hasMany(UserCourse, { onDelete: "CASCADE" });
UserCourse.belongsTo(Course);

Course.belongsToMany(Course, {
  through: Prequisite,
  as: "prequisites",
});
//Course.hasMany(Course, { as: "prequisites" });

UserQuestionsRepliesComment.belongsTo(User);
User.hasMany(UserQuestionsRepliesComment, { onDelete: "CASCADE" });

UserQuestionsReplies.hasMany(UserQuestionsRepliesComment, {
  onDelete: "CASCADE",
});
UserQuestionsRepliesComment.belongsTo(UserQuestionsReplies);

UserQuestions.hasMany(UserQuestionsReplies, { onDelete: "CASCADE" });
UserQuestionsReplies.belongsTo(UserQuestions);

User.hasMany(UserQuestions, { onDelete: "CASCADE" });
UserQuestions.belongsTo(User);

User.hasMany(UserQuestionsReplies, { onDelete: "CASCADE" });
UserQuestionsReplies.belongsTo(User);
User.hasMany(UserVote, { onDelete: "CASCADE" });
Course.hasMany(UserQuestions, { onDelete: "CASCADE" });

User.hasMany(UserTestGrade, { onDelete: "CASCADE" });
UserTestGrade.belongsTo(User);

Course.hasMany(UserTestGrade, { onDelete: "CASCADE" });
UserTestGrade.belongsTo(Course);

Course.hasOne(CourseURL, { onDelete: "CASCADE" });
CourseURL.belongsTo(Course);

Course.hasMany(CourseAssignment, { onDelete: "CASCADE" });
CourseAssignment.belongsTo(Course);

User.hasMany(CourseAssignment, { onDelete: "CASCADE" });
CourseAssignment.belongsTo(User);

CourseSectionComponent.hasMany(CourseAssignment, { onDelete: "CASCADE" });
CourseAssignment.belongsTo(CourseSectionComponent);

Question.hasMany(CourseEssay, { onDelete: "CASCADE" });
CourseEssay.belongsTo(Question);
User.hasMany(CourseEssay, { onDelete: "CASCADE" });
CourseEssay.belongsTo(User);
Course.hasMany(CourseEssay, { onDelete: "CASCADE" });
CourseEssay.belongsTo(Course);

User.hasMany(UserCourseComponent, { onDelete: "CASCADE" });
UserCourseComponent.belongsTo(User);

CourseSectionComponent.hasMany(UserCourseComponent, { onDelete: "CASCADE" });
UserCourseComponent.belongsTo(CourseSectionComponent);
