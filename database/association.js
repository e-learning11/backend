const User = require("../models/user");
const Course = require("../models/courses");
const CourseSection = require("../models/course_section");
const CourseSectionComponent = require("../models/course_section_component");
const UserCourse = require("../models/user_course");
CourseSection.hasMany(CourseSectionComponent);
Course.hasMany(CourseSection);

Course.belongsToMany(User, {
  through: UserCourse,
});
