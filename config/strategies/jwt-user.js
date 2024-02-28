const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

// JWT 토큰 추출 옵션 설정
let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); // Bearer 토큰에서 JWT 추출
opts.secretOrKey = process.env.SHA_KEY;
/**
 * JWT 전략 생성
 */
const jwt = new JwtStrategy(opts, async (jwt_payload, done) => {
  return done(null, { ...jwt_payload }); // Assume successful JWT verification
});

module.exports = jwt;
