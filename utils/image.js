const sharp = require("sharp");
/**
 * modifyImage
 * @param {Buffer} image
 * @param {Object} options
 * modify image properties based on options
 */
async function modifyImage(image, options) {
  try {
    if (!image) return null;
    const buffer = await sharp(image).resize(options).toBuffer();
    return buffer;
  } catch (ex) {
    return null;
  }
}

module.exports = {
  modifyImage,
};
