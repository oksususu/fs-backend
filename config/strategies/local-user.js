const LocalStrategy = require("passport-local");
const accountController = require("../../controllers/account");
const jwt = require("jsonwebtoken");
const secret = process.env.SHA_KEY;

// LocalStrategy 설정
const config = {
  usernameField: "email",
  passwordField: "password",
};

// LocalStrategy 생성
const local = new LocalStrategy(config, async (email, password, done) => {
  try {
    const users = await accountController.authenticate(email, password);

    if (users.length === 1) {
      const accessToken = jwt.sign({ email, info: "info" }, secret, { expiresIn: "1d" }); // 1일 뒤 만료되는 accessToken
      const refreshToken = jwt.sign({}, secret, { expiresIn: "3d" }); // 3일 뒤 만료되는 refreshToken
      done(null, { accessToken, refreshToken });
    } else if (users.length === 0) {
      done(null, false, { message: "이메일이나 비밀번호가 틀렸습니다." });
    } else {
      done(null, false, { message: "여러 사용자가 조회됩니다." }); // 이미 db내 uk 설정으로 해당 케이스가 없겠지만
    }
  } catch (error) {
    done(error, null);
  }
});

module.exports = local;
