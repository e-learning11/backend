const sequelize = require("../database/connection").sequelize;
const { Op } = require("sequelize");
const User = require("../models/user");
const Course = require("../models/courses");
const CourseSection = require("../models/course_section");
const CourseSectionComponent = require("../models/course_section_component");
const UserCourse = require("../models/user_course");
const errorHandler = require("../utils/error");
const CONSTANTS = require("../utils/const");
const Question = require("../models/question");
const Answer = require("../models/answer");
const Prequisite = require("../models/course_prequisite");
const UserTestGrade = require("../models/user_grades");
const CourseURL = require("../models/course_url");
const CourseAssignment = require("../models/course_assignment");
const CourseEssay = require("../models/course_essay");
const UserCourseComponent = require("../models/user_course_component");
const UserQuestions = require("../models/user_questions");

async function createCourse(userId, course, image, req) {
  const t = await sequelize.transaction();

  try {
    const {
      name,
      summary,
      description,
      prerequisites,
      language,
      date,
      sections,
      age,
      gender,
      private,
      url,
    } = course;
    // check that url is unique
    if (url) {
      const urlCourse = await CourseURL.findOne({
        where: {
          url: url,
        },
      });
      if (urlCourse) {
        throw new Error(
          JSON.stringify({
            errors: [{ message: "this url already exists please try another" }],
          })
        );
      }
    }

    let imageReq = image;

    let courseObj = await Course.create(
      {
        name: name,
        summary: summary,
        description: description,
        language: language,
        date: date,
        approved: true,
        ageMin: age[0],
        ageMax: age[1],
        gender: gender,
        image: imageReq,
        private: private,
      },
      { transaction: t }
    );
    if (url)
      await CourseURL.create(
        {
          CourseId: courseObj.id,
          url: url,
        },
        {
          transaction: t,
        }
      );
    for (let prequisiteId of prerequisites) {
      await Prequisite.create(
        {
          CourseId: courseObj.id,
          prequisiteId: Number(prequisiteId),
        },
        { transaction: t }
      );
    }
    await UserCourse.create(
      {
        CourseId: courseObj.id,
        UserId: userId,
        type: CONSTANTS.CREATED,
      },
      { transaction: t }
    );
    let videoFileIndex = 0;
    let assignmentFileIndex = 0;
    for (let section of sections) {
      let sectionObj = await CourseSection.create(
        {
          name: section.name,
          start: section.start,
          end: section.end,
          CourseId: courseObj.id,
        },
        { transaction: t }
      );

      for (let component of section.components) {
        let file = null;
        let contentType = "";
        if (
          (!component.File && component.type == CONSTANTS.ASSIGNMENT) ||
          (component.type == CONSTANTS.ASSIGNMENT &&
            !req.files["assignmentFile"][assignmentFileIndex])
        ) {
          throw new Error(
            JSON.stringify({
              errors: [
                { message: "every assignment must have a file attached to it" },
              ],
            })
          );
        }
        if (
          component.File &&
          (component.type == CONSTANTS.VIDEO ||
            component.type == CONSTANTS.ASSIGNMENT)
        ) {
          if (component.type == CONSTANTS.VIDEO) {
            file = req.files["vidoeFile"][videoFileIndex].buffer;
            contentType = req.files["vidoeFile"][videoFileIndex].mimetype;
            videoFileIndex++;
          } else {
            file = req.files["assignmentFile"][assignmentFileIndex].buffer;
            contentType =
              req.files["assignmentFile"][assignmentFileIndex].mimetype;

            assignmentFileIndex++;
          }
        }
        let courseSelectionComponentObj = await CourseSectionComponent.create(
          {
            number: component.number,
            videoID: component.videoID,
            name: component.name,
            type: component.type,
            CourseSectionId: sectionObj.id,
            file: file,
            passingGrade: component.passingGrade,
            hasFile: file == null ? false : true,
            contentType: contentType,
            description: component.description,
          },
          { transaction: t }
        );
        if (component.test) {
          for (let question of component.test) {
            let correctAnswer = null;

            try {
              correctAnswer = question.A[question.correctAnswer];
            } catch (ex) {
              correctAnswer = null;
            }
            let questionObj = await Question.create(
              {
                CourseSectionComponentId: courseSelectionComponentObj.id,
                Q: question.Q,
                type: question.type,
                correctAnswer: correctAnswer,
              },
              { transaction: t }
            );
            if (question.A) {
              for (let answer of question.A) {
                let answerObj = await Answer.create(
                  {
                    A: answer,
                    QuestionId: questionObj.id,
                  },
                  { transaction: t }
                );
              }
            }
          }
        }
      }
    }
    await t.commit();
    courseObj.image = null;
    //console.log(courseObj);
    return courseObj;
  } catch (ex) {
    //console.log(req.files["image"][0]);
    await t.rollback();
    console.log(ex);
    return -1;
  }
}
async function enrollUserInCourse(courseId, userId) {
  try {
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    const course = await Course.findOne({
      where: {
        id: courseId,
        approved: true,
      },
    });
    if (user.type != CONSTANTS.STUDENT)
      throw new Error(
        JSON.stringify({ errors: [{ message: "must be a student" }] })
      );
    if (course.gender != CONSTANTS.BOTH && course.gender != user.gender)
      throw new Error(
        JSON.stringify({ errors: [{ message: "gender difference" }] })
      );
    //console.log(user.id, course.ageMin, user.age, course.ageMax);
    if (!(user.age >= course.ageMin && user.age <= course.ageMax))
      throw new Error(
        JSON.stringify({ errors: [{ message: "age difference" }] })
      );
    // check if user meets the required prequisites
    const coursePrequisites = await Prequisite.findAll({
      where: {
        CourseId: courseId,
      },
    });
    const userFinishedCourses = await UserCourse.findAll({
      where: {
        UserId: userId,
        type: CONSTANTS.FINISHED,
      },
    });
    //console.log(coursePrequisites, userFinishedCourses);
    for (let prequisite of coursePrequisites) {
      let found = false;
      for (let userFinishedCourse of userFinishedCourses) {
        if (userFinishedCourse.CourseId == prequisite.prequisiteId)
          found = true;
      }
      if (!found)
        throw new Error(
          JSON.stringify({
            errors: [{ message: "doesnt match course requirements" }],
          })
        );
    }
    const enrolledCourseState = await UserCourse.create({
      UserId: userId,
      CourseId: courseId,
      type: CONSTANTS.ENROLLED,

      currentComponent: 1,
    });
    return 1;
  } catch (ex) {
    return 0;
  }
}
module.exports = {
  createCourse,
  enrollUserInCourse,
};
