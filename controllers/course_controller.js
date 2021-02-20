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
/**
 * getEnrolledCoursesByUser
 * @param {Request} req
 * @param {Response} res
 * get courses that user enroll in
 */
async function getEnrolledCoursesByUser(req, res) {
  try {
    const userId = req.user.id;
    const { limit, offset } = req.query;
    const userCourses = await Course.findAll({
      limit: Number(limit),
      offset: Number(offset),
      include: [
        {
          model: UserCourse,
          where: {
            UserId: userId,
            type: CONSTANTS.ENROLLED,
          },
        },
      ],
    });
    const coursesToSendBack = [];
    for (let course of userCourses) {
      coursesToSendBack.push({
        id: course.id,
        name: course.name,
        summary: course.summary,
        description: course.summary,
        date: course.date,
        gender: course.gender,
        ageMin: course.ageMin,
        ageMax: course.ageMax,
        private: course.private,
      });
    }
    res.status(200).send(coursesToSendBack).end();
  } catch (ex) {
    console.log(ex);
    errorHandler(req, res, ex);
  }
}

/**
 * getFinishedCoursesByUser
 * @param {Request} req
 * @param {Response} res
 * get courses that user enroll in
 */
async function getFinishedCoursesByUser(req, res) {
  try {
    const userId = req.user.id;
    const { limit, offset } = req.query;

    const userCourses = await Course.findAll({
      limit: Number(limit),
      offset: Number(offset),
      include: [
        {
          model: UserCourse,
          where: {
            UserId: userId,
            type: CONSTANTS.FINISHED,
          },
        },
      ],
    });
    const coursesToSendBack = [];
    for (let course of userCourses) {
      coursesToSendBack.push({
        id: course.id,
        name: course.name,
        summary: course.summary,
        description: course.summary,
        date: course.date,
        gender: course.gender,
        ageMin: course.ageMin,
        ageMax: course.ageMax,
        private: course.private,
      });
    }
    res.status(200).send(coursesToSendBack).end();
  } catch (ex) {
    console.log(ex);
    errorHandler(req, res, ex);
  }
}
/**
 * getCoursesCreatedByuser
 * @param {Request} req
 * @param {Response} res
 * get courses that teacher created
 */
async function getCoursesCreatedByuser(req, res) {
  try {
    const userId = req.user.id;
    const { limit, offset } = req.query;
    const userCourses = await Course.findAll({
      limit: Number(limit),
      offset: Number(offset),
      include: [
        {
          model: UserCourse,
          where: {
            UserId: userId,
            type: CONSTANTS.CREATED,
          },
        },
      ],
    });
    const coursesToSendBack = [];
    for (let course of userCourses) {
      coursesToSendBack.push({
        id: course.id,
        name: course.name,
        summary: course.summary,
        description: course.summary,
        date: course.date,
        gender: course.gender,
        ageMin: course.ageMin,
        ageMax: course.ageMax,
        private: course.private,
      });
    }
    res.status(200).send(coursesToSendBack).end();
  } catch (ex) {
    console.log(ex);
    errorHandler(req, res, ex);
  }
}
/**
 * getRandomCourses
 * @param {Request} req
 * @param {Response} res
 * get random courses
 */
async function getRandomCourses(req, res) {
  try {
    const count = Number(req.query.count);
    const courses = await Course.findAll({
      limit: count,
      where: {
        private: false,
      },
    });
    const coursesToSendBack = [];
    for (let course of courses) {
      coursesToSendBack.push({
        id: course.id,
        name: course.name,
        summary: course.summary,
        description: course.summary,
        date: course.date,
        gender: course.gender,
        ageMin: course.ageMin,
        ageMax: course.ageMax,
        private: course.private,
      });
    }
    res.status(200).send(coursesToSendBack).end();
  } catch (ex) {
    console.log(ex);
    errorHandler(req, res, ex);
  }
}
/**
 * createCourse
 * @param {Request} req
 * @param {Response} res
 * teacher create course
 */
async function createCourse(req, res) {
  const t = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    if (user.type != CONSTANTS.TEACHER)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "not a teacher" }],
        })
      );

    const {
      name,
      summary,
      description,
      prerequisites,
      language,
      date,
      sections,
      age, // array of 2 numbers
      gender,
      private,
      url,
    } = JSON.parse(req.body.json);
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

    let imageReq = req.files["image"];
    //console.log(imageReq);
    if (imageReq && req.files["image"][0] && req.files["image"][0].buffer)
      imageReq = req.files["image"][0].buffer;
    else imageReq = null;

    let courseObj = await Course.create(
      {
        name: name,
        summary: summary,
        description: description,
        language: language,
        date: date,
        approved: false,
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
        if (
          component.File &&
          (component.type == CONSTANTS.VIDEO ||
            component.type == CONSTANTS.ASSIGNMENT)
        ) {
          if (component.type == CONSTANTS.VIDEO) {
            file = req.files["vidoeFile"][videoFileIndex].buffer;
            videoFileIndex++;
          } else {
            file = req.files["assignmentFile"][assignmentFileIndex].buffer;
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
    res.status(200).send(courseObj).end();
  } catch (ex) {
    //console.log(req.files["image"][0]);
    console.log(ex);
    t.rollback();
    errorHandler(req, res, ex);
  }
}
/**
 * getCourseFullInfo
 * @param {Request} req
 * @param {Response} res
 * get all information about course
 */
async function getCourseFullInfo(req, res) {
  try {
    const { type, typeId } = req.query;
    const where = {};
    if (type == CONSTANTS.COURSE_BY_ID) {
      where.id = Number(typeId);
      where.private = false;
    } else if (type == CONSTANTS.COURSE_BY_URL) {
      const courseFromURL = await CourseURL.findOne({
        where: {
          url: typeId,
        },
      });
      if (!courseFromURL)
        throw new Error(
          JSON.stringify({ errors: [{ message: "no course with this url" }] })
        );
      where.id = courseFromURL.CourseId;
    } else {
      throw new Error(
        JSON.stringify({
          errors: [
            {
              message:
                "please check that you specified correct query parameters",
            },
          ],
        })
      );
    }

    const course = await Course.findOne({
      where: where,
      attributes: [
        "id",
        "name",
        "summary",
        "description",
        "language",
        "date",
        "approved",
        "private",
        "gender",
        "ageMin",
        "ageMax",
      ],
      include: [
        {
          model: CourseSection,
          include: [
            {
              model: CourseSectionComponent,
              attributes: [
                "number",
                "name",
                "videoID",
                "type",
                "passingGrade",
                "id",
                "hasFile",
              ],
              include: [
                {
                  model: Question,
                  attributes: ["id", "Q", "type"],
                  include: [{ model: Answer }],
                },
              ],
            },
          ],
        },
        {
          model: User,
          attributes: [
            "id",
            "firstName",
            "lastName",
            "email",
            "phone",
            "gender",
            "age",
          ],
        },
        {
          model: Course,
          as: "prequisites",
          attributes: ["id", "name", "summary"],
        },
      ],
    });
    if (!course)
      throw new Error(
        JSON.stringify({ errors: [{ message: "no course with this id" }] })
      );
    // console.log(course.get());
    let courseToSendBack = course.get();
    courseToSendBack.image = null;
    courseToSendBack.instructor = course.Users[0];
    //console.log(course.instructor);
    courseToSendBack.Users = null;
    delete courseToSendBack.Users;
    courseToSendBack.instructor.UserCourse = null;
    res.status(200).send(courseToSendBack).end();
  } catch (ex) {
    console.log(ex);
    errorHandler(req, res, ex);
  }
}
/**
 * getUserCourseState
 * @param {Request} req
 * @param {Response} res
 * get user course state and info
 */
async function getUserCourseState(req, res) {
  try {
    const userId = await req.user.id;
    const courseId = Number(req.query.courseId);
    const course = await Course.findOne({
      include: [
        {
          model: UserCourse,
          where: {
            UserId: userId,
            CourseId: courseId,
          },
        },
      ],
    });
    if (!course) {
      res.status(204).end();
      return;
    }
    course.image = null;
    res.status(200).send(course.UserCourses[0]).end();
  } catch (ex) {
    console.log(ex);
    errorHandler(req, res, ex);
  }
}

/**
 * enrollUserInCourse
 * @param {Request} req
 * @param {Response} res
 *enroll user in course
 */
async function enrollUserInCourse(req, res) {
  try {
    const userId = await req.user.id;
    const courseId = Number(req.query.courseId);
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    const course = await Course.findOne({
      where: {
        id: courseId,
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
    res.status(200).send(enrolledCourseState).end();
  } catch (ex) {
    console.log(ex);
    errorHandler(req, res, ex);
  }
}
/**
 * autoGradeTest
 * @param {Request} req
 * @param {Response} res
 * auto grade MCQ and true and false tests and return the result as array of 1 for correct answers and 0 for wrong answers
 */
async function autoGradeTest(req, res) {
  const t = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const testId = Number(req.query.testId);
    const courseId = Number(req.query.courseId);
    const answers = req.body.answers;
    const results = [];
    let grade = 0;
    let isFinished = true;
    for (let answer of answers) {
      let question = await Question.findOne({
        where: {
          id: Number(answer.questionId),
        },
      });
      if (!question)
        throw new Error(
          JSON.stringify({
            errors: [
              { message: "no question with this id" + answer.questionId },
            ],
          })
        );
      if (!CONSTANTS.AUTOGRADE_TYPE.includes(question.type)) {
        isFinished = false;
        results.push(-1);
        // check if essay submitted before
        const userEssay = await CourseEssay.findOne({
          where: {
            UserId: userId,
            CourseId: Number(courseId),
            QuestionId: Number(question.id),
            testId: Number(testId),
          },
        });
        if (!userEssay)
          await CourseEssay.create(
            {
              UserId: userId,
              CourseId: Number(courseId),
              QuestionId: Number(question.id),
              text: answer.answer,
              testId: Number(testId),
            },
            { transaction: t }
          );
        else {
          userEssay.isGraded = false;
          userEssay.text = answer.answer;
          await userEssay.save({ transaction: t });
        }
        continue;
      }
      if (question.correctAnswer == answer.answer) {
        results.push(1);
        grade += 1;
      } else results.push(0);
    }
    // check if user solved quiz or test before
    let userGrade = await UserTestGrade.findOne({
      where: {
        UserId: userId,
        testId: testId,
        CourseId: courseId,
      },
    });
    if (!userGrade) {
      userGrade = await UserTestGrade.create(
        {
          UserId: userId,
          testId: testId,
          CourseId: courseId,
          grade: grade,
          lastTimeSubmit: Date.now(),
          isDone: isFinished ? CONSTANTS.TEST_GRADED : CONSTANTS.TEST_UNGRADED,
        },
        { transaction: t }
      );
    } else {
      userGrade.lastTimeSubmit = Date.now();
      userGrade.grade = grade;
      userGrade.state = isFinished
        ? CONSTANTS.TEST_GRADED
        : CONSTANTS.TEST_UNGRADED;
      await userGrade.save({ transaction: t });
    }
    await t.commit();
    res
      .status(200)
      .send({
        results: grade,
        testState: isFinished ? CONSTANTS.TEST_GRADED : CONSTANTS.TEST_UNGRADED,
      })
      .end();
  } catch (ex) {
    await t.rollback();
    console.log(ex);
    errorHandler(req, res, ex);
  }
}

/**
 * getTestState
 * @param {Request} req
 * @param {Response} res
 */
async function getTestState(req, res) {
  try {
    const userId = req.user.id;
    const { testId, courseId } = req.query;
    // check if there is a userTestGrade or userEssaySubmitted and check if al is graded
    let testState = CONSTANTS.TEST_SUBMITTED;
    const courseSectionComponent = await CourseSectionComponent.findOne({
      where: {
        id: Number(testId),
      },
      include: [{ model: Question, include: [{ model: Answer }] }],
    });
    if (!courseSectionComponent)
      throw new Error(
        JSON.stringify({ errors: [{ message: "no test with this id" }] })
      );
    let noOfGradedEssays = 0;
    let noOfUnGradedEssays = 0;
    let isEssayUnsubmitted = false;
    let noOfUnsubmittedAutoGrade = 0;
    let grade = 0;
    let firstTime = 0;
    for (let [i, question] of courseSectionComponent.Questions.entries()) {
      //console.log(question.type);
      if (question.type == CONSTANTS.ESSAY_QUESTION) {
        // check for essay state
        const essaySubmission = await CourseEssay.findOne({
          where: {
            UserId: userId,
            CourseId: Number(courseId),
            QuestionId: Number(question.id),
            testId: Number(testId),
          },
        });
        if (!essaySubmission) isEssayUnsubmitted = true;
        else if (essaySubmission.isGraded) {
          noOfGradedEssays++;
          grade += essaySubmission.grade;
        } else noOfUnGradedEssays++;
      } else {
        // check that autogradedtest is submitted
        const testGrade = await UserTestGrade.findOne({
          where: {
            UserId: userId,
            testId: Number(testId),
            CourseId: Number(courseId),
          },
        });
        if (!testGrade) noOfUnsubmittedAutoGrade++;
        else if (!firstTime) {
          firstTime = 1;
          grade += testGrade.grade;
        }
      }
    }

    if (noOfUnsubmittedAutoGrade || isEssayUnsubmitted)
      testState = CONSTANTS.TEST_NOTSUBMITTED;
    else if (noOfUnGradedEssays) testState = CONSTANTS.TEST_UNGRADED;
    else testState = CONSTANTS.TEST_GRADED;
    res.status(200).send({ testState: testState, grade: grade }).end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}

/**
 * getAssignmentState
 * @param {Request} req
 * @param {Response} res
 */
async function getAssignmentState(req, res) {
  try {
    const userId = req.user.id;
    const { courseId, assignmentId } = req.query;
    let assignmentState = CONSTANTS.TEST_NOTSUBMITTED;
    const userAssignment = await CourseAssignment.findOne({
      where: {
        UserId: userId,
        CourseId: Number(courseId),
        CourseSectionComponentId: Number(assignmentId),
      },
    });
    let grade = 0;
    if (!userAssignment) assignmentState = CONSTANTS.TEST_NOTSUBMITTED;
    else if (userAssignment.isGraded) {
      assignmentState = CONSTANTS.TEST_GRADED;
      grade += userAssignment.grade;
    } else assignmentState = CONSTANTS.TEST_UNGRADED;
    res
      .status(200)
      .send({ assignmentState: assignmentState, grade: grade })
      .end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}
/**
 * getTestGrade
 * @param {Request} req
 * @param {Response} res
 */
async function getTestGrade(req, res) {
  try {
    const userId = req.user.id;
    const testId = Number(req.query.testId);
    const courseId = Number(req.query.courseId);

    const userAutoGrade = await UserTestGrade.findOne({
      where: {
        testId: testId,
        UserId: userId,
        CourseId: courseId,
      },
    });
    if (!userAutoGrade)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "no test submitted with this id" }],
        })
      );
    const autoGrade = userAutoGrade.grade;
    let essayGrades = 0;
    const userEssays = await CourseEssay.findAll({
      where: {
        testId: testId,
        UserId: userId,
        CourseId: courseId,
      },
    });
    for (let userEssay of userEssays) {
      essayGrades += userEssay.grade;
    }
    res.status(200).send({
      autoGrades: autoGrade,
      essayGrades: essayGrades,
    });
  } catch (ex) {
    console.log(ex);
    errorHandler(req, res, ex);
  }
}
/**
 * getAllCourses
 * @param {Request} req
 * @param {Response} res
 * get all courses using pagnition for front and home page
 */
async function getAllCourses(req, res) {
  try {
    const { offset, limit } = req.query;
    // check for filters
    const where = {
      private: false,
    };
    const order = [];
    let sortOrder = "DESC";
    if (req.query.language) where.language = req.query.language;
    if (req.query.name) where.name = req.query.name;
    if (req.query.date) where.date = req.query.date;
    if (req.query.gender) where.gender = Number(req.query.gender);
    if (req.query.courseId) where.id = Number(req.query.courseId);
    if (req.query.sortOrder && ["DESC", "ASC"].includes(req.query.sortOrder))
      sortOrder = req.query.sortOrder;
    if (
      req.query.sort &&
      CONSTANTS.COURSE_SORT_PARAMETERS.includes(req.query.sort)
    )
      order.push([req.query.sort, sortOrder]);
    //if (req.query.age) where.age = Number(req.query.age);
    const courses = await Course.findAll({
      where: where,
      order: order,
      limit: Number(limit),
      offset: Number(offset),
      include: [
        {
          model: UserCourse,
          where: {
            type: CONSTANTS.CREATED,
          },
        },
        {
          model: User,
        },
      ],
    });
    const coursesToSendBack = [];
    for (let course of courses) {
      coursesToSendBack.push({
        courseId: course.id,
        teacherId: course.Users[0].id,
        name: course.name,
        summary: course.summary,
        instructor: {
          firstName: course.Users[0].firstName,
          lastName: course.Users[0].lastName,
          id: course.Users[0].id,
        },
      });
    }
    res.send(coursesToSendBack).end();
  } catch (ex) {
    console.log(ex);
    errorHandler(req, res, ex);
  }
}

/**
 * markComponentAsDone
 * @param {Request} req
 * @param {Response} res
 * mark component as done for a student
 */
async function markComponentAsDone(req, res) {
  const t = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const courseId = Number(req.query.courseId);
    const componentId = Number(req.query.componentId);
    const userCourse = await UserCourse.findOne({
      where: {
        CourseId: courseId,
        UserId: userId,
        type: CONSTANTS.ENROLLED,
      },
    });
    if (!userCourse)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "user is not enrolled in this course" }],
        })
      );
    const courseComponent = await CourseSectionComponent.findOne({
      where: {
        id: componentId,
      },
    });
    if (!courseComponent)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "no compoent with this id" }],
        })
      );

    // check if this compoent is test
    if (courseComponent.type == CONSTANTS.TEST) {
      // check that user passed minimum grade
      const userGrade = await UserTestGrade.findOne({
        where: {
          UserId: userId,
          CourseId: courseId,
          testId: componentId,
        },
      });
      if (!userGrade || userGrade.grade < courseComponent.passingGrade)
        throw new Error(
          JSON.stringify({
            errors: [{ message: "user didn't pass the test" }],
          })
        );
    } else if (courseComponent.type == CONSTANTS.ASSIGNMENT) {
      const userGrade = await CourseAssignment.findOne({
        where: {
          UserId: userId,
          CourseId: courseId,
          CourseSectionComponentId: componentId,
        },
      });
      if (!userGrade || userGrade.grade < courseComponent.passingGrade)
        throw new Error(
          JSON.stringify({
            errors: [{ message: "user didn't pass the assignment" }],
          })
        );
    }

    // check that user finished the last one before mark this one as complete

    if (courseComponent.number == 1) {
      // if first compoent then mark as done with no checks and make user go to next component
      userCourse.currentComponent = 2;
    } else {
      // check that user finished compoent with number courseCompoent.number-1

      const prevCourse = await Course.findOne({
        where: {
          id: courseId,
        },
        attributes: ["id"],
        include: [
          {
            model: CourseSection,
            attributes: ["id"],
            include: [
              {
                model: CourseSectionComponent,
                where: {
                  number: courseComponent.number - 1,
                },
              },
            ],
          },
        ],
      });
      const prevCourseComponent =
        prevCourse.CourseSections[0].CourseSectionComponents[0];
      if (!prevCourseComponent)
        throw new Error(
          JSON.stringify({
            errors: [
              {
                message:
                  "please check that you sent the right query parameters and the correct ids",
              },
            ],
          })
        );
      const courseUserComponent = await UserCourseComponent.findOne({
        where: {
          CourseSectionComponentId: prevCourseComponent.id,
          isDone: true,
        },
      });
      if (!courseUserComponent)
        throw new Error(
          JSON.stringify({
            errors: [
              {
                message:
                  "cannot mark this component as complete as user didn't finish the previus component",
              },
            ],
          })
        );

      userCourse.currentComponent = courseComponent.number + 1;
    }

    await userCourse.save({ transaction: t });
    const userCourseSectionCompoent = await UserCourseComponent.findOne({
      where: {
        UserId: userId,
        CourseSectionComponentId: componentId,
      },
    });
    if (!userCourseSectionCompoent) {
      await UserCourseComponent.create(
        {
          UserId: userId,
          CourseSectionComponentId: componentId,
          isDone: true,
        },
        { transaction: t }
      );
    } else {
      userCourseSectionCompoent.isDone = true;
      await userCourseSectionCompoent.save({ transaction: t });
    }
    await t.commit();
    res.status(200).send(String(userCourse.currentComponent)).end();
  } catch (ex) {
    //console.log(ex);
    await t.rollback();
    errorHandler(req, res, ex);
  }
}

/**
 * getCompoentStatus
 * @param {Request} req
 * @param {Response} res
 * get compoent status for student
 */
async function getCompoentStatus(req, res) {
  try {
    const userId = req.user.id;
    const courseId = Number(req.query.courseId);
    const componentId = Number(req.query.componentId);
    const userCourse = await UserCourse.findOne({
      where: {
        CourseId: courseId,
        UserId: userId,
        type: CONSTANTS.ENROLLED,
      },
    });
    if (!userCourse)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "user is not enrolled in this course" }],
        })
      );
    const isDone = await UserCourseComponent.findOne({
      where: {
        UserId: userId,
        CourseSectionComponentId: componentId,
      },
    });
    let finished = true;
    if (!isDone || !isDone.isDone) finished = true;
    res.status(200).send({ isDone: finished }).end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}
/**
 * markCourseAsComplete
 * @param {Request} req
 * @param {Response} res
 * mark course as done for a student
 */
async function markCourseAsComplete(req, res) {
  try {
    const userId = req.user.id;
    const courseId = Number(req.query.courseId);
    const userCourse = await UserCourse.findOne({
      where: {
        CourseId: courseId,
        UserId: userId,
        type: CONSTANTS.ENROLLED,
      },
    });
    userCourse.type = CONSTANTS.FINISHED;
    await userCourse.save();
    res.status(200).send("done").end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}
/**
 * getCourseOverview
 * @param {Request} req
 * @param {Response} res
 * get basic course info like enrolled students and grader and assignemnts..etc
 */
async function getCourseOverview(req, res) {
  try {
    const { courseId } = req.query;
    const course = await Course.findOne({
      where: {
        id: Number(courseId),
      },
      include: [
        {
          limit: 10,
          model: UserCourse,
          include: [
            {
              model: User,
              attributes: [
                "id",
                "firstName",
                "lastName",
                "email",
                "gender",
                "age",
              ],
            },
          ],
          where: {
            CourseId: Number(courseId),

            [Op.or]: [
              { type: CONSTANTS.ENROLLED },
              { type: CONSTANTS.FINISHED },
            ],
          },
        },
      ],
    });
    if (!course)
      throw new Error(
        JSON.stringify({ errors: [{ message: "no course with this id" }] })
      );
    course.image = null;

    const courseToSendBack = course.get();
    courseToSendBack.image = null;
    courseToSendBack.enrolledUsers = [];
    courseToSendBack.noOfEnrolledUsers = courseToSendBack.UserCourses.length;
    for (let userCourses of course.UserCourses) {
      let userObj = userCourses.User;
      userObj.type = userCourses.type;
      courseToSendBack.enrolledUsers.push(userObj);
    }
    delete courseToSendBack.UserCourses;
    // get number of esay submits
    const noOfEssaySubmits = await CourseEssay.count({
      where: {
        CourseId: Number(courseId),
      },
    });
    courseToSendBack.noOfEssaySubmits = noOfEssaySubmits;
    // get number of esay submits
    const noOfAssignmentSubmits = await CourseAssignment.count({
      where: {
        CourseId: Number(courseId),
      },
    });
    courseToSendBack.noOfAssignmentSubmits = noOfAssignmentSubmits;
    // get number of ungraded essays
    const noOfUngradedEssaySubmits = await CourseEssay.count({
      where: {
        CourseId: Number(courseId),
        isGraded: false,
      },
    });
    courseToSendBack.noOfUngradedEssaySubmits = noOfUngradedEssaySubmits;
    // get number of ungraded assignment
    const noOfUngradedAssignmentSubmits = await CourseAssignment.count({
      where: {
        CourseId: Number(courseId),
        isGraded: false,
      },
    });
    courseToSendBack.noOfUngradedAssignmentSubmits = noOfUngradedAssignmentSubmits;
    // get number of d=forum question for course
    const noOfForumQuestions = await UserQuestions.count({
      where: {
        CourseId: Number(courseId),
      },
    });
    courseToSendBack.noOfForumQuestions = noOfForumQuestions;
    res.status(200).send(courseToSendBack).end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}
/**
 * submitAssignmentAnswer
 * @param {Request} req
 * @param {Response} res
 * submit answer to an assignment which is not autograded
 */
async function submitAssignmentAnswer(req, res) {
  try {
    const userId = req.user.id;
    const { courseId, assignmentId, text } = req.body;
    // check that user is enrolled in course
    const userCourse = await UserCourse.findOne({
      where: {
        UserId: userId,
        CourseId: Number(courseId),
        type: CONSTANTS.ENROLLED,
      },
    });
    if (!userCourse)
      throw new Error(
        JSON.stringify({ errors: [{ message: "user not enrolled in course" }] })
      );
    let file = null;
    if (req.file && req.file.buffer) file = req.file.buffer;
    // chekc if answer is laready found or not
    let answer = await CourseAssignment.findOne({
      where: {
        UserId: userId,
        CourseId: Number(courseId),
        CourseSectionComponentId: Number(assignmentId),
      },
    });
    if (!answer) {
      answer = await CourseAssignment.create({
        UserId: userId,
        CourseId: Number(courseId),
        CourseSectionComponentId: Number(assignmentId),
        text: text,
        file: file,
      });
    } else {
      answer.text = text;
      answer.file = file;
      answer.isGraded = false;
      await answer.save();
    }
    res.status(200).send(answer).end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}
/**
 * getCourseAssignmentsSubmits
 * @param {Request} req
 * @param {Response} res
 * get course submits for assignment sections
 */
async function getCourseAssignmentsSubmits(req, res) {
  try {
    const userId = req.user.id;
    let {
      courseId,
      courseSectionComponentId,
      enrolledUerId,
      limit,
      offset,
      isGraded,
      sort,
      sortOrder,
    } = req.query;
    const where = {};
    const order = [];
    if (courseSectionComponentId)
      where.CourseSectionComponentId = Number(courseSectionComponentId);
    if (enrolledUerId) where.UserId = Number(enrolledUerId);
    if (isGraded) where.isGraded = isGraded == "true" ? true : false;
    if (!(sortOrder && ["DESC", "ASC"].includes(sortOrder))) sortOrder = "DESC";
    if (sort && ["grade", "createdAt", "updatedAt"].includes(sort))
      order.push([[sort, sortOrder]]);
    where.CourseId = Number(courseId);
    // check that the user is owner of course
    const userCourse = await UserCourse.findOne({
      where: {
        CourseId: Number(courseId),
        UserId: userId,
        type: CONSTANTS.CREATED,
      },
    });
    if (!userCourse)
      throw new Error(
        JSON.stringify({ errors: [{ message: "user not owner of course" }] })
      );
    const coursesAssignmentsSubmits = await CourseAssignment.findAll({
      where: where,
      order: order,
      limit: Number(limit),
      offset: Number(offset),
    });
    res.status(200).send(coursesAssignmentsSubmits).end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}
/**
 * gradeAssignmentSubmission
 * @param {Request} req
 * @param {Response} res
 * grade a submisiion of assignment form user
 */
async function gradeAssignmentSubmission(req, res) {
  try {
    const userId = req.user.id;
    const { assignmentSubmissionId, grade, courseId } = req.body;
    if (!assignmentSubmissionId)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "please add assignmentSubmissionId" }],
        })
      );
    if (!courseId)
      throw new Error(
        JSON.stringify({ errors: [{ message: "please add courseId" }] })
      );
    if (!grade)
      throw new Error(
        JSON.stringify({ errors: [{ message: "please add grade" }] })
      );
    // check that the user is owner of course
    const userCourse = await UserCourse.findOne({
      where: {
        CourseId: Number(courseId),
        UserId: userId,
        type: CONSTANTS.CREATED,
      },
    });
    if (!userCourse)
      throw new Error(
        JSON.stringify({ errors: [{ message: "user not owner of course" }] })
      );
    const assignmentSubmission = await CourseAssignment.findOne({
      where: {
        id: Number(assignmentSubmissionId),
        CourseId: Number(courseId),
      },
    });
    if (!assignmentSubmission)
      throw new Error(
        JSON.stringify({ errors: [{ message: "no assignment with this id" }] })
      );
    assignmentSubmission.grade = Number(grade);
    assignmentSubmission.isGraded = true;
    await assignmentSubmission.save();
    res.status(200).send(assignmentSubmission).end();
  } catch (ex) {
    console.log(ex);
    errorHandler(req, res, ex);
  }
}

/**
 * submitEssayAnswer
 * @param {Request} req
 * @param {Response} res
 * submit answer to an essay which is not autograded
 */
async function submitEssayAnswer(req, res) {
  try {
    const userId = req.user.id;
    const { courseId, questionId, text, testId } = req.body;
    // check that user is enrolled in course
    const userCourse = await UserCourse.findOne({
      where: {
        UserId: userId,
        CourseId: Number(courseId),
        type: CONSTANTS.ENROLLED,
      },
    });
    if (!userCourse)
      throw new Error(
        JSON.stringify({ errors: [{ message: "user not enrolled in course" }] })
      );
    const answer = await CourseEssay.create({
      UserId: userId,
      CourseId: Number(courseId),
      QuestionId: Number(questionId),
      text: text,
      testId: Number(testId),
    });
    res.status(200).send(answer).end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}

/**
 * getCourseEssaysSubmits
 * @param {Request} req
 * @param {Response} res
 * get course submits for essay question
 */
async function getCourseEssaysSubmits(req, res) {
  try {
    const userId = req.user.id;
    let {
      courseId,
      questionId,
      enrolledUerId,
      limit,
      offset,
      testId,
      isGraded,
      sort,
      sortOrder,
    } = req.query;
    const order = [];
    const where = {};
    if (questionId) where.QuestionId = Number(questionId);
    if (enrolledUerId) where.UserId = Number(enrolledUerId);
    if (testId) where.testId = Number(testId);
    if (isGraded) where.isGraded = isGraded == "true" ? true : false;
    if (!(sortOrder && ["DESC", "ASC"].includes(sortOrder))) sortOrder = "DESC";
    if (sort && ["grade", "createdAt", "updatedAt"].includes(sort))
      order.push([[sort, sortOrder]]);
    where.CourseId = Number(courseId);
    // check that the user is owner of course
    const userCourse = await UserCourse.findOne({
      where: {
        CourseId: Number(courseId),
        UserId: userId,
        type: CONSTANTS.CREATED,
      },
    });
    if (!userCourse)
      throw new Error(
        JSON.stringify({ errors: [{ message: "user not owner of course" }] })
      );
    const coursesEssaysSubmits = await CourseEssay.findAll({
      where: where,
      order: order,
      limit: Number(limit),
      offset: Number(offset),
    });
    res.status(200).send(coursesEssaysSubmits).end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}

/**
 * gradeEssaySubmission
 * @param {Request} req
 * @param {Response} res
 * grade a submisiion of essay rorm user
 */
async function gradeEssaySubmission(req, res) {
  try {
    const userId = req.user.id;
    const { essaySubmissionId, grade, courseId } = req.body;
    if (!essaySubmissionId)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "please add essaySubmissionId" }],
        })
      );
    if (!courseId)
      throw new Error(
        JSON.stringify({ errors: [{ message: "please add courseId" }] })
      );
    if (!grade)
      throw new Error(
        JSON.stringify({ errors: [{ message: "please add grade" }] })
      );
    // check that the user is owner of course
    const userCourse = await UserCourse.findOne({
      where: {
        CourseId: Number(courseId),
        UserId: userId,
        type: CONSTANTS.CREATED,
      },
    });
    if (!userCourse)
      throw new Error(
        JSON.stringify({ errors: [{ message: "user not owner of course" }] })
      );
    const essaySubmission = await CourseEssay.findOne({
      where: {
        id: Number(essaySubmissionId),
        CourseId: Number(courseId),
      },
    });
    if (!essaySubmission)
      throw new Error(
        JSON.stringify({ errors: [{ message: "no essay with this id" }] })
      );
    essaySubmission.grade = Number(grade);
    essaySubmission.isGraded = true;
    await essaySubmission.save();
    res.status(200).send(essaySubmission).end();
  } catch (ex) {
    console.log(ex);
    errorHandler(req, res, ex);
  }
}
/**
 * editCourseBasicInfo
 * @param {Request} req
 * @param {Response} res
 * edit basic course info
 */
async function editCourseBasicInfo(req, res) {
  const t = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const {
      courseId,
      name,
      summary,
      language,
      description,
      gender,
      private,
      ageMin,
      ageMax,
      url,
    } = req.body;

    // check that the user is owner of course
    const userCourse = await UserCourse.findOne({
      where: {
        CourseId: Number(courseId),
        UserId: userId,
        type: CONSTANTS.CREATED,
      },
    });
    if (!userCourse)
      throw new Error(
        JSON.stringify({ errors: [{ message: "user not owner of course" }] })
      );
    const course = await Course.findOne({
      where: {
        id: courseId,
      },
    });
    course.name = name || course.name;
    course.summary = summary || course.summary;
    course.language = language || course.language;
    course.description = description || course.description;
    course.gender = Number(gender) || course.gender;
    course.ageMin = Number(ageMin) || course.ageMin;
    course.ageMax = Number(ageMax) || course.ageMax;
    course.image = req.file?.buffer ? req.file.buffer : course.image;

    if (String(private) == "true") {
      if (url) {
        const urlCourse = await CourseURL.findOne({
          where: {
            url: url,
          },
        });
        if (urlCourse) {
          throw new Error(
            JSON.stringify({
              errors: [
                { message: "this url already exists please try another" },
              ],
            })
          );
        }
        const courseURL = await CourseURL.findOne({
          where: {
            CourseId: course.id,
          },
        });
        await CourseURL.create(
          {
            CourseId: course.id,
            url: url,
          },
          {
            transaction: t,
          }
        );

        if (courseURL)
          await CourseURL.destroy({
            where: {
              url: courseURL.url,
            },
            transaction: t,
          });
        course.private = true;
        //course.url = url;
      }
    } else {
      course.private = false;
      const courseURL = await CourseURL.findOne({
        where: {
          CourseId: course.id,
        },
      });
      if (courseURL)
        await CourseURL.destroy({
          where: {
            url: courseURL.url,
          },
          transaction: t,
        });
    }
    await course.save({ transaction: t });
    await t.commit();
    course.image = null;
    res.status(200).send(course).end();
  } catch (ex) {
    await t.rollback();
    errorHandler(req, res, ex);
  }
}

/**
 * editFullCourse
 * @param {Request} req
 * @param {Response} res
 * edit every detail about course and its associates
 */
async function editFullCourse(req, res) {
  const t = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const {
      courseId,
      gender,
      private,
      url,
      age,
      name,
      summary,
      description,
      prerequisites,
      language,
      date,
      sections,
    } = JSON.parse(req.body.json);
    // check that the user is owner of course
    const userCourse = await UserCourse.findOne({
      where: {
        CourseId: Number(courseId),
        UserId: userId,
        type: CONSTANTS.CREATED,
      },
    });
    if (!userCourse)
      throw new Error(
        JSON.stringify({ errors: [{ message: "user not owner of course" }] })
      );
    const course = await Course.findOne({
      where: {
        id: Number(courseId),
      },
    });
    if (!course)
      throw new Error(
        JSON.stringify({ errors: [{ message: "no course exist with id" }] })
      );
    course.name = name;
    course.gender = Number(gender);
    course.summary = summary;
    course.description = description;
    course.language = language;
    course.date = date;
    course.private = private;
    course.ageMax = Number(age[1]);
    course.ageMin = Number(age[0]);
    // check if url exist before
    const courseURL = url
      ? await CourseURL.findOne({
          where: {
            url: url,
          },
        })
      : null;
    if (courseURL && courseURL.CourseId != Number(courseId))
      throw new Error(
        JSON.stringify({ errors: [{ message: "the url is not valid" }] })
      );

    await CourseURL.destroy({
      where: {
        CourseId: courseId,
      },
      transaction: t,
    });

    // check if image changed
    if (
      req.files["image"] &&
      req.files["image"][0] &&
      req.files["image"][0].buffer
    )
      course.image = await req.files["image"][0].buffer;
    await course.save({ transaction: t });
    // remove old prequistes
    await Prequisite.destroy({
      where: {
        CourseId: course.id,
      },
      transaction: t,
    });
    // edit prequeistes
    for (let prequisiteId of prerequisites) {
      await Prequisite.create(
        {
          CourseId: course.id,
          prequisiteId: Number(prequisiteId),
        },
        { transaction: t }
      );
    }
    // edit new sections
    let videoFileIndex = 0;
    let assignmentFileIndex = 0;
    for (let section of sections) {
      let sectionId = null;
      if (section.id) {
        sectionId = section.id;
        // section already exist
        const sectionDB = await CourseSection.findOne({
          where: {
            id: Number(section.id),
          },
        });
        sectionDB.name = section.name;
        sectionDB.start = section.start;
        sectionDB.end = section.end;
        await sectionDB.save({ transaction: t });
      } else {
        // create new section
        const sectionDB = await CourseSection.create(
          {
            name: section.name,
            start: section.start,
            end: section.end,
            CourseId: course.id,
          },
          { transaction: t }
        );
        sectionId = sectionDB.id;
      }

      // loop on section compoent

      for (let component of section.components) {
        let componentId = null;
        let file = null;
        let componentReset = component.reset;
        // if compoent reset reset all progress
        if (componentReset) {
          await UserCourseComponent.destroy({
            where: {
              CourseSectionComponentId: component.id,
            },
            transaction: t,
          });
        }

        if (
          component.File &&
          (component.type == CONSTANTS.VIDEO ||
            component.type == CONSTANTS.ASSIGNMENT)
        ) {
          if (component.type == CONSTANTS.VIDEO) {
            file = req.files["vidoeFile"][videoFileIndex].buffer;
            videoFileIndex++;
          } else {
            file = req.files["assignmentFile"][assignmentFileIndex].buffer;
            assignmentFileIndex++;
          }
        }

        if (component.id) {
          componentId = component.id;
          // compoent already exist
          const componentDB = await CourseSectionComponent.findOne({
            where: {
              id: component.id,
            },
          });

          componentDB.number = component.number;
          componentDB.name = component.name;
          componentDB.videoID = component.videoID;
          componentDB.type = component.type;
          componentDB.passingGrade = component.passingGrade;
          componentDB.CourseSectionId = sectionId;
          componentDB.file = file;
          await componentDB.save({ transaction: t });
        } else {
          const componentDB = await CourseSectionComponent.create(
            {
              number: component.number,
              videoID: component.videoID,
              name: component.name,
              type: component.type,
              CourseSectionId: sectionId,
              file: file,
              passingGrade: component.passingGrade,
            },
            { transaction: t }
          );
          componentId = componentDB.id;
        }

        // check if test to add questions
        if (component.test) {
          for (let question of component.test) {
            let questionId = null;
            let correctAnswer = null;
            try {
              correctAnswer = question.A[question.correctAnswer];
            } catch (ex) {
              correctAnswer = null;
            }
            if (question.id) {
              questionId = question.id;
              const questionDB = await Question.findOne({
                where: {
                  id: question.id,
                },
              });

              questionDB.CourseSectionComponentId = componentId;
              questionDB.Q = question.Q;
              questionDB.type = question.type;
              questionDB.correctAnswer = correctAnswer;
              await questionDB.save({ transaction: t });
            } else {
              let questionDB = await Question.create(
                {
                  CourseSectionComponentId: componentId,
                  Q: question.Q,
                  type: question.type,
                  correctAnswer: correctAnswer,
                },
                { transaction: t }
              );
              questionId = questionDB.id;
            }
            // loop on answers
            if (question.A) {
              // remove all previous answers
              await Answer.destroy({
                where: {
                  QuestionId: questionId,
                },
                transaction: t,
              });
              for (let answer of question.A) {
                let answerDB = await Answer.create(
                  {
                    A: answer,
                    QuestionId: questionId,
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
    course.image = null;
    res.status(200).send(course).end();
  } catch (ex) {
    await t.rollback();
    console.log(ex);
    errorHandler(req, res, ex);
  }
}
/**
 * getComponentFile
 * @param {Request} req
 * @param {Response} res
 * get file of specific compoent
 */
async function getComponentFile(req, res) {
  try {
    const { componentId } = req.query;
    const component = await CourseSectionComponent.findOne({
      where: {
        id: Number(componentId),
      },
    });
    if (!component)
      throw new Error(
        JSON.stringify({ errors: [{ message: "no component with this id" }] })
      );
    res.end(component.file, "binary");
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}

/**
 * getUserAutoTestGrade
 * @param {Request} req
 * @param {Response} res
 * get user auto grade for specific test
 */
async function getUserAutoTestGrade(req, res) {
  try {
    const { userId, testId, courseId } = req.query;
    if (!userId)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "please add userId as a query parameter" }],
        })
      );
    if (!testId)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "please add testId as a query parameter" }],
        })
      );
    const grade = await UserTestGrade.findOne({
      where: {
        UserId: Number(userId),
        testId: Number(testId),
        CourseId: Number(courseId),
      },
    });
    if (!grade)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "no auto grade for this test with this user" }],
        })
      );
    res.status(200).send(grade).end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}

/**
 * getUserEssayGrade
 * @param {Request} req
 * @param {Response} res
 * get user essay grade for specific test
 */
async function getUserEssayGrade(req, res) {
  try {
    const { userId, questionId, courseId } = req.query;
    if (!userId)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "please add userId as a query parameter" }],
        })
      );
    if (!questionId)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "please add questionId as a query parameter" }],
        })
      );

    const grade = await CourseEssay.findOne({
      where: {
        UserId: Number(userId),
        QuestionId: Number(questionId),
        CourseId: Number(courseId),
      },
    });
    if (!grade)
      throw new Error(
        JSON.stringify({
          errors: [
            { message: "no essay grade for this question with this user" },
          ],
        })
      );
    res.status(200).send(grade).end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}
/**
 *deleteCourse
 * @param {Request} req
 * @param {Response} res
 */
async function deleteCourse(req, res) {
  try {
    const userId = req.user.id;
    const { courseId } = req.query;
    if (!courseId)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "please add courseId as a query parameter" }],
        })
      );
    const userCourse = await UserCourse.findOne({
      where: {
        UserId: userId,
        type: CONSTANTS.CREATED,
        CourseId: Number(courseId),
      },
    });
    if (!userCourse)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "user is not owner of course" }],
        })
      );
    await Course.destroy({
      where: {
        id: Number(courseId),
      },
    });
    res.status(200).send("deleted successfully").end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}
/**
 * getCourseEnrolledUsers
 * @param {Request} req
 * @param {Response} res
 */
async function getCourseEnrolledUsers(req, res) {
  try {
    const userId = req.user.id;
    const { limit, offset, courseId } = req.query;
    if (!limit)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "please add limit as query option" }],
        })
      );
    if (!courseId)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "please add courseId as query option" }],
        })
      );
    if (!offset)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "please add offset as query option" }],
        })
      );

    // check that the user is owner of course
    const userCourse = await UserCourse.findOne({
      where: {
        CourseId: Number(courseId),
        UserId: userId,
        type: CONSTANTS.CREATED,
      },
    });
    if (!userCourse)
      throw new Error(
        JSON.stringify({ errors: [{ message: "user not owner of course" }] })
      );
    const enrolledUsers = await UserCourse.findAll({
      limit: Number(limit),
      offset: Number(offset),
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "email", "gender", "age"],
        },
      ],
      where: {
        CourseId: Number(courseId),

        [Op.or]: [{ type: CONSTANTS.ENROLLED }, { type: CONSTANTS.FINISHED }],
      },
    });
    const usersToSendBack = [];
    for (let userCourses of enrolledUsers) {
      let userObj = userCourses.User;
      userObj.type = userCourses.type;
      usersToSendBack.push(userObj);
    }
    res.status(200).send(usersToSendBack).end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}
module.exports = {
  getEnrolledCoursesByUser,
  getCoursesCreatedByuser,
  getRandomCourses,
  createCourse,
  getCourseFullInfo,
  getUserCourseState,
  enrollUserInCourse,
  autoGradeTest,
  getAllCourses,
  markComponentAsDone,
  markCourseAsComplete,
  getFinishedCoursesByUser,
  getCourseOverview,
  submitAssignmentAnswer,
  getCourseAssignmentsSubmits,
  gradeAssignmentSubmission,
  submitEssayAnswer,
  getCourseEssaysSubmits,
  gradeEssaySubmission,
  editCourseBasicInfo,
  getCompoentStatus,
  editFullCourse,
  getComponentFile,
  getUserAutoTestGrade,
  getUserEssayGrade,
  getTestGrade,
  deleteCourse,
  getTestState,
  getAssignmentState,
  getCourseEnrolledUsers,
};
