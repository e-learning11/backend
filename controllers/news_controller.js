const NewsPost = require("../models/news_post");
const errorHandler = require("../utils/error");
/**
 * getNewsPost
 * @param {Request} req
 * @param {Response} res
 */
async function getNewsPost(req, res) {
  try {
    const { offset, limit } = req.query;
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
    const newsPosts = await NewsPost.findAll({
      limit: Number(limit),
      offset: Number(offset),
      attributes: ["text", "title"],
    });
    res.status(200).send(newsPosts).end();
  } catch (ex) {
    errorHandler(req, res, ex);
  }
}
module.exports = { getNewsPost };
