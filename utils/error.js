/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Error} error
 */
module.exports = function (req, res, error) {
  console.log(error);
  try {
    // console.log(typeof error);
    if (typeof error.message == "string") {
      error = JSON.parse(error.message);
      //console.log("error mess", error.message);
    }
    //console.log("error", error.errors, error, error.Error);
    let errorMessage = String(error.errors[0].message);
    res.status(400).send(errorMessage).end();
  } catch (ex) {
    console.log(ex);
    res.status(400).send("error has occured").end();
  }
};
