/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Error} error
 */
module.exports = function (req, res, error) {
  res.status(400).send("error has occured");
};
