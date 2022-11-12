const User = require("../models/user");
const hashModule = require("../utils/hash");
const authenticationModule = require("../utils/authentication");
const errorHandler = require("../utils/error");
const UserCourse = require("../models/user_course");
const CONSTANTS = require("../utils/const");
const Course = require("../models/courses");
const uuid = require("uuid");
const mail = require("../utils/mail");
const Sequelize = require("sequelize");
const imageHelper = require("../utils/image");
/**
 * login
 * @param {Request} req
 * @param {Response} res
 * function to check if email and password user enterd entered is correct or not
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!user)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "no user with this email" }],
        })
      );

    if (await hashModule.compareStringWithHash(password, user.password)) {
      // Check if the the accounted is activated
      if (user.activated === false) {
        res
          .status(400)
          .send(
            "Not Verified"
          )
          .end();
        return;
      }
      // ceck if teacher and not approved dont send any token
      else if (user.type == CONSTANTS.TEACHER && !user.approved) {
        res
          .status(400)
          .send(
            "Not Approved"
          )
          .end();
        return;
      }
      const token = authenticationModule.createToken(user.id);
      res.status(200).send(token).end();
    } else {
      throw new Error(
        JSON.stringify({
          errors: [{ message: "wrong email or password" }],
        })
      );
    }
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}

/**
 * signup
 * @param {Request} req
 * @param {Response} res
 * function to create new user if everything is correct
 */
async function signup(req, res) {
  try {
    const {
      email,
      password,
      phone,
      firstName,
      lastName,
      type,
      gender,
      age,
    } = req.body;
    //console.log(req.body, req.file);

    const hashedPassword = await hashModule.hashString(password);
    // check if email duplicated better error
    const isEmailFound = await User.findOne({
      where: {
        email: email,
      },
    });
    if (isEmailFound)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "this email is used before" }],
        })
      );
    if (![CONSTANTS.TEACHER, CONSTANTS.STUDENT].includes(type))
      throw new Error(
        JSON.stringify({
          errors: [
            { message: "the allowed types are only student and teacher" },
          ],
        })
      );
    let imageFile = req.file?.buffer;
    imageFile = await imageHelper.modifyImage(
      imageFile,
      CONSTANTS.USER_IMAGE_OPTIONS
    );

    // Create the link that is sent in the email
    const link = "TestLink.com";
    // Create token Send Confirmation mail
    const confirmationCode = String(uuid.v4());
    const emailToSend = {
      from: process.env.SENDING_MAIL,
      to: email,
      title: "Shabaab Alaaksa User Confirmation",
      text: `Please click on this link to verify your email:\n
      الرجاء الضغط على اللينك لتأكيد البريد الالكترونى \n
      ${link}`,
      html: `<p>Please click on this link to verify your email:\n <p/> <p>الرجاء الضغط على اللينك لتأكيد البريد الالكترونى<p/> <a>${link}</a>`,
      subject: "Shabaab Alaaksa User Confirmation",
    };
    await mail.sendMail(emailToSend);

    // Create the user in the database
    const user = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      phone: phone,
      type: type,
      image: imageFile,
      approved: false,
      gender: gender,
      age: age || -1,
      confirmationCode: confirmationCode,
      activated: false
    });

    // Send response
    res.status(200).send("Verify email").end();
  } catch (ex) {
    console.log(ex);
    errorHandler(req, res, ex);
  }
}
/**
 * getProfile
 * @param {Request} req
 * @param {Response} res
 *  get user profile info
 */
async function getProfile(req, res) {
  try {
    const userId = req.user.id;
    //console.log("userId", userId);
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    //console.log(user);
    res
      .status(200)
      .json({
        email: user.email,
        id: user.id,
        type: user.type,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        gender: user.gender,
        age: user.age,
      })
      .end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}
/**
 * editProfile
 * @param {Request} req
 * @param {Response} res
 * edit user profile
 */
async function editProfile(req, res) {
  try {
    const userId = req.user.id;
    const {
      password,
      gender,
      firstName,
      lastName,
      email,
      phone,
      type,
      age,
    } = req.body;
    let imageFile = req.file;
    if (imageFile && imageFile.buffer) imageFile = imageFile.buffer;
    else imageFile = null;
    imageFile = await imageHelper.modifyImage(
      imageFile,
      CONSTANTS.USER_IMAGE_OPTIONS
    );
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    // console.log("user", user);
    let hashedPassword = null;
    if (password) hashedPassword = hashModule.hashString(password);
    await User.update(
      {
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        gender: gender || user.gender,
        email: email || user.email,
        phone: phone || user.phone,
        password: hashedPassword || user.password,
        age: age || user.age,
        image: imageFile || user.image,
      },
      {
        where: {
          id: userId,
        },
      }
    );
    const updatedUser = await User.findOne({
      where: {
        id: userId,
      },
    });
    updatedUser.password = null;
    updatedUser.image = null;
    res.status(200).send(updatedUser).end();
  } catch (ex) {
    console.log(ex);
    errorHandler(req, res, ex);
  }
}
/**
 * deleteUser
 * @param {Request} req
 * @param {Response} res
 */
async function deleteUser(req, res) {
  try {
    const userId = req.user.id;
    const coursesCreated = await UserCourse.findAll({
      where: {
        UserId: userId,
        type: CONSTANTS.CREATED,
      },
    });
    await User.destroy({
      where: {
        id: userId,
      },
    });
    for (let course of coursesCreated)
      await Course.destroy({
        where: {
          id: course.CourseId,
        },
      });
    res.status(200).send("deleted successfully").end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}
/**
 * getPublicProfile
 * @param {Request} req
 * @param {Response} res
 */
async function getPublicProfile(req, res) {
  try {
    const { userId } = req.query;
    if (!userId)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "please add userId in query parameter" }],
        })
      );
    const user = await User.findOne({
      where: {
        id: Number(userId),
      },
      attributes: [
        "id",
        "firstName",
        "lastName",
        "email",
        "type",
        "gender",
        "phone",
        "age",
      ],
    });
    if (!user)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "no user with this id" }],
        })
      );
    res.status(200).send(user).end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}

/**
 * forgetPassword
 * @param {Request} req
 * @param {Response} res
 */
async function forgetPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      where: { email: email },
    });
    if (!user)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "no user with this email" }],
        })
      );
    const token = String(uuid.v4());
    user.token = token;
    user.resetPassword = true;
    user.tokenDate = Date.now();
    const emailToSend = {
      from: process.env.SENDING_MAIL,
      to: email,
      title: "Reset Password",
      text: `Reset your password with this token:\n ${token}
      please note that the token is valid for only 5 hours`,
      html: `<p>Reset your password with this token:\n <b>${token}</b>
      <p>please note that the token is valid for only <b>5</b> hours</p>`,
      subject: "Reset Password",
    };
    await mail.sendMail(emailToSend);
    await user.save();
    res.status(200).send("sent email").end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}

/**
 * resetPassword
 * @param {Request} req
 * @param {Response} res
 */
async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;
    if (!token)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "no token was provided" }],
        })
      );
    if (!password)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "no password was provided" }],
        })
      );
    const user = await User.findOne({
      where: {
        token: token,
        resetPassword: true,
      },
    });
    if (!user)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "no user with this token" }],
        })
      );
    // check that token didnt expire
    const elapsedTime = (Date.now() - user.tokenDate) / 36e5;
    if (elapsedTime > 5) {
      user.resetPassword = false;
      await user.save();
      throw new Error(
        JSON.stringify({
          errors: [{ message: "token has expired" }],
        })
      );
    }

    user.token = "";
    user.resetPassword = false;
    user.password = await hashModule.hashString(password);
    await user.save();
    res.status(200).send("password changed successfully").end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}

/**
 * getAllTeachers
 * @param {Request} req
 * @param {Response} res
 */
async function getAllTeachers(req, res) {
  try {
    const limit = req.query.limit;
    const offset = req.query.offset;
    if (!offset)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "please add offset in query parameter" }],
        })
      );
    if (!limit)
      throw new Error(
        JSON.stringify({
          errors: [{ message: "please add limit in query parameter" }],
        })
      );
    const where = { type: CONSTANTS.TEACHER, approved: true };
    const order = [];
    let sortOrder = "DESC";
    if (req.query.userId) where.id = Number(req.query.userId);
    if (req.query.sortOrder && ["ASC", "DESC"].includes(req.query.sortOrder))
      sortOrder = req.query.sortOrder;
    if (req.query.sort && ["createdAt", "age"].includes(req.query.sort))
      order.push([req.query.sort, sortOrder]);
    if (req.query.age) where.age = Number(req.query.age);
    if (req.query.gender) where.gender = Number(req.query.gender);
    if (req.query.email) where.email = req.query.email;
    if (req.query.firstName) where.firstName = req.query.firstName;
    if (req.query.lastName) where.lastName = req.query.lastName;
    if (req.query.fullname) {
      // not satisfied with this way, can be improved by not passing full name
      const names = String(req.query.fullname).split(" ");
      const usersToSendBack = [];
      for (let name of names) {
        where.firstName = { [Sequelize.Op.like]: `%${name}%` };
        const users1 = await User.findAll({
          where: where,
          limit: Number(limit),
          offset: Number(offset),
          order: order,
          attributes: [
            "id",
            "email",
            "firstName",
            "lastName",
            "age",
            "gender",
            "type",
            "phone",
            "createdAt",
          ],
        });
        delete where.firstName;
        where.lastName = { [Sequelize.Op.like]: `%${req.query.fullname}%` };
        const users2 = await User.findAll({
          where: where,
          limit: Number(limit),
          offset: Number(offset),
          order: order,
          attributes: [
            "id",
            "email",
            "firstName",
            "lastName",
            "age",
            "gender",
            "type",
            "phone",
            "createdAt",
          ],
        });

        for (let user of users1) {
          let exist = false;
          for (let u of usersToSendBack) {
            if (u.id == user.id) {
              exist = true;
              break;
            }
          }
          if (!exist) usersToSendBack.push(user);
        }
        for (let user of users2) {
          let exist = false;
          for (let u of usersToSendBack) {
            if (u.id == user.id) {
              exist = true;
              break;
            }
          }
          if (!exist) usersToSendBack.push(user);
        }
      }

      res.status(200).send(usersToSendBack).end();
    } else {
      const users = await User.findAll({
        where: where,
        limit: Number(limit),
        offset: Number(offset),
        order: order,
        attributes: [
          "id",
          "email",
          "firstName",
          "lastName",
          "age",
          "gender",
          "type",
          "phone",
          "createdAt",
        ],
      });
      res.status(200).send(users).end();
    }
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}
module.exports = {
  login,
  signup,
  getProfile,
  editProfile,
  deleteUser,
  getPublicProfile,
  forgetPassword,
  resetPassword,
  resetPassword,
  getAllTeachers,
};
