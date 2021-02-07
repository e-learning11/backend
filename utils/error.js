/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Error} error
 */
module.exports = function (req, res, error) {
  try {
    let errorMessage = String(error.errors[0].message);
    res.status(400).send(errorMessage).end();
  } catch (ex) {
    res.status(400).send("error has occured").end();
  }
};
