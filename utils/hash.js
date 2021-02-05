// this module is used for hashing and dehashing any string
const bcrypt = require("bcrypt");
const saltRounds = Number(process.env.BCRYPT_SALT);

async function hashString(string) {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(string, salt);
  return hash;
}

async function compareStringWithHash(plain, hashed) {
  return await bcrypt.compare(plain, hashed);
}

module.exports = {
  hashString,
  compareStringWithHash,
};
