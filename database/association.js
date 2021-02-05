const User = require("../models/user");
const Course = require("../models/courses");
const CourseSection = require("../models/course_section");
const CourseSectionComponent = require("../models/course_section_component");
const UserCourse = require("../models/user_course");
const Question = require("../models/question");
const Answer = require("../models/answer");

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
