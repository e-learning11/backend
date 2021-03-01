// this module is used for hashing and dehashing any string
const bcrypt = require("bcrypt");
const saltRounds = Number(process.env.BCRYPT_SALT);
/**
 * hashString
 * @param {String} string
 * hash string based on salt and salt rounds
 */
async function hashString(string) {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(string, salt);
  return hash;
}
/**
 * compareStringWithHash
 * @param {String} plain
 * @param {string} hashed
 * compare hashed string with plain one and return true if they are thhe same and false otherwise
 */
async function compareStringWithHash(plain, hashed) {
  return await bcrypt.compare(plain, hashed);
}

module.exports = {
  hashString,
  compareStringWithHash,
};
