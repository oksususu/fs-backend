class ValidationError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

/**
 * 비동기 에러 처리 미들웨어 함수.
 * @param {function} requestHandler - 요청 핸들러 함수.
 * @returns {function} Express 미들웨어 함수.
 */
const asyncHandler = (requestHandler) => {
  return async (req, res, next) => {
    try {
      await requestHandler(req, res, next); // 이때 middleware 함수를 받기위해 next도 넣어주기!
    } catch (err) {
      if (err instanceof ValidationError) {
        res.status(err.status).json({ errorMessage: err.message });
      } else {
        console.log("error", err.message);
        res.status(500).json({ errorMessage: err.message });
      }
    }
  };
};

module.exports = { ValidationError, asyncHandler };
