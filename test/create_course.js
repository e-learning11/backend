const sequelize = require("../database/connection").sequelize;
const Course = require("../models/courses");
const CourseSection = require("../models/course_section");
const CourseSectionComponent = require("../models/course_section_component");
const UserCourse = require("../models/user_course");
const CONSTANTS = require("../utils/const");
const Question = require("../models/question");
const Answer = require("../models/answer");
const Prequisite = require("../models/course_prequisite");
const CourseURL = require("../models/course_url");

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
    console.log(courseObj);
    return courseObj;
  } catch (ex) {
    //console.log(req.files["image"][0]);
    t.rollback();
    console.log(ex);
    return -1;
  }
}

module.exports = {
  createCourse,
};
