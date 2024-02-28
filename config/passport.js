const passport = require("passport");
const localUser = require("./strategies/local-user");
const jwtUser = require("./strategies/jwt-user.js");

// Passport 설정 함수
module.exports = () => {
  passport.use("local-user", localUser);
  passport.use("jwt-user", jwtUser);
};
