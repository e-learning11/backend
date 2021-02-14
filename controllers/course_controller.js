const sequelize = require("../database/connection").sequelize;
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
/**
 * getEnrolledCoursesByUser
 * @param {Request} req
 * @param {Response} res
 * get courses that user enroll in
 */
async function getEnrolledCoursesByUser(req, res) {
  try {
    const userId = req.user.id;
    const userCourses = await Course.findAll({
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
    const userCourses = await Course.findAll({
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
    const userCourses = await Course.findAll({
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
      let videoFileIndex = 0;
      let assignmentFileIndex = 0;
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
          },
          { transaction: t }
        );
        if (component.test) {
          for (let question of component.test) {
            let questionObj = await Question.create(
              {
                CourseSectionComponentId: courseSelectionComponentObj.id,
                Q: question.Q,
                type: question.type,
                correctAnswer: question.correctAnswer,
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
              attributes: ["number", "name", "videoID", "type", "passingGrade"],
              include: [{ model: Question, include: [{ model: Answer }] }],
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
            type: CONSTANTS.ENROLLED,
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

      currentComponent: 0,
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
  try {
    const userId = req.user.id;
    const testId = Number(req.query.testId);
    const answers = req.body.answers;
    const results = [];
    const courseSectionComponent = await CourseSectionComponent.findOne({
      where: {
        id: testId,
      },
      include: [{ model: Question, include: [{ model: Answer }] }],
    });
    let grade = 0;
    for (let [i, question] of courseSectionComponent.Questions.entries()) {
      if (!CONSTANTS.AUTOGRADE_TYPE.includes(question.type)) continue;
      if (question.correctAnswer == answers[i]) {
        results.push(1);
        grade += 1;
      } else results.push(0);
    }
    // check if user solved quiz or test before
    const userGrade = await UserTestGrade.findOne({
      where: {
        UserId: userId,
        testId: testId,
      },
    });
    if (!userGrade) {
      await UserTestGrade.create({
        UserId: userId,
        testId: testId,
        grade: grade,
        lastTimeSubmit: Date.now(),
      });
    } else {
      userGrade.lastTimeSubmit = Date.now();
      userGrade.grade = grade;
      await userGrade.save();
    }

    res.status(200).send(results).end();
  } catch (ex) {
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
    userCourse.currentComponent += 1;
    await userCourse.save();
    res.status(200).send(String(userCourse.currentComponent)).end();
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
          model: UserCourse,
          where: {
            CourseId: Number(courseId),
            type: CONSTANTS.ENROLLED,
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
    courseToSendBack.noOfEnrolledUsers = courseToSendBack.UserCourses.length;
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
    const { courseId, courseSectionComponentId, text } = req.body;
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
    const answer = await CourseAssignment.create({
      UserId: userId,
      CourseId: Number(courseId),
      CourseSectionComponentId: Number(courseSectionComponentId),
      text: text,
    });
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
    const {
      courseId,
      courseSectionComponentId,
      enrolledUerId,
      limit,
      offset,
    } = req.query;
    const where = {};
    if (courseSectionComponentId)
      where.CourseSectionComponentId = Number(courseSectionComponentId);
    if (enrolledUerId) where.UserId = Number(enrolledUerId);
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
    const { assignmentId, grade, courseId } = req.body;
    if (!assignmentId)
      throw new Error(
        JSON.stringify({ errors: [{ message: "please add assignmentId" }] })
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
        id: Number(assignmentId),
        CourseId: Number(courseId),
      },
    });
    if (!assignmentSubmission)
      throw new Error(
        JSON.stringify({ errors: [{ message: "no assignment with this id" }] })
      );
    assignmentSubmission.grade = Number(grade);
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
    const { courseId, questionId, text } = req.body;
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
    const { courseId, questionId, enrolledUerId, limit, offset } = req.query;
    const where = {};
    if (questionId) where.QuestionId = Number(questionId);
    if (enrolledUerId) where.UserId = Number(enrolledUerId);
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
    const { essayId, grade, courseId } = req.body;
    if (!essayId)
      throw new Error(
        JSON.stringify({ errors: [{ message: "please add essayId" }] })
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
        id: Number(essayId),
        CourseId: Number(courseId),
      },
    });
    if (!essaySubmission)
      throw new Error(
        JSON.stringify({ errors: [{ message: "no essay with this id" }] })
      );
    essaySubmission.grade = Number(grade);
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
};
