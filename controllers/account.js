const crypto = require("crypto");
const { ValidationError } = require("../utils/async-handler");
const client = require("../config/dbClient");

const secret = process.env.SHA_KEY;

/* func : 사용자 인증 */
exports.authenticate = async (email, password) => {
  const password_hash = crypto.createHmac("sha256", secret).update(password).digest("hex");
  const query = `select * from public.user where email = '${email}' and password_hash = '${password_hash}'`;

  const users = await client.query(query).then((res) => res.rows);

  return users;
};

/* 사용자 정보 조회 */
exports.getUserInfo = async (req, res) => {
  const { email } = req.user;
  const query = `select * from public.user where email = '${email}'`;

  const users = await client.query(query).then((res) => res.rows);
  if (users.length === 0) {
    throw new ValidationError(404, `해당 유저가 존재하지 않습니다. 고객센터로 문의 바랍니다`);
  }

  const user = users[0];
  res.json(user);
};

/* 회원 가입 */
exports.signUp = async (req, res) => {
  let { userName, email, password, address, phoneNumber } = req.body;

  // 비밀번호 암호화
  const crypto = require("crypto");
  const hashed = crypto.createHmac("sha256", secret).update(password).digest("hex");
  password = hashed;

  // account 유효성 체크
  const query = `select * from public.user where email='${email}'`;
  const users = await client.query(query).then((res) => res.rows);
  if (users.length !== 0) {
    throw new ValidationError(400, `이미 존재하는 email입니다`);
  }

  // userInfo 데이터 넣는 코드
  const insert_row = {
    text: "insert into public.user (user_name, email, password_hash, address, phone_number) values ($1, $2, $3, $4, $5)",
    values: [userName, email, password, address, phoneNumber],
  };
  await client.query(insert_row);

  res.json("ok");
};

/* 회원 탈퇴 */
exports.deleteUser = async (req, res) => {
  const { email } = req.user;
  const query = `delete from public.user where email='${email}' RETURNING *`;

  const users = await client.query(query).then((res) => res.rows);
  if (users.length === 0) {
    throw new ValidationError(400, `이미 탈퇴되었거나, 존재하지 않는 유저입니다`);
  }
  res.json(users[0]);
};

/* 회원 수정 */
exports.updateUser = async (req, res) => {
  let { userName, password, address, phoneNumber } = req.body;
  const { email } = req.user;

  // 비밀번호 암호화
  const crypto = require("crypto");
  const hashed = crypto.createHmac("sha256", secret).update(password).digest("hex");
  password = hashed;

  // account 유효성 체크 안함 : 존재하지 않는 유저라면 로그인조차 안 될 것이므로

  // userInfo 데이터 넣는 코드
  const updateInfo = `user_name = '${userName}', password_hash = '${password}', address = '${address}', phone_number = '${phoneNumber}' `;
  const updateQuery = `update public.user set ${updateInfo} where email='${email}' RETURNING *`;
  const userInfo = await client.query(updateQuery).then((res) => res.rows);

  res.json(userInfo[0]);
};

/* 로그인 */
exports.signIn = async (req, res) => {
  res.json(req.user);
};
