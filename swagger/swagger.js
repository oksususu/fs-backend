const swaggerJSDoc = require("swagger-jsdoc");

// Swagger 설정 옵션 객체
const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "fs API",
      version: "1.0.0",
      description: "node.js 기반의 rest api",
    },
    host: "localhost:3000",
    basePath: "/",
  },
  apis: ["./routes/*.js", "./routes/*.yml", "./swagger/*", "./app.js"], //Swagger 파일 연동
};

const specs = swaggerJSDoc(options); // Swagger 문서 객체 생성

module.exports = { specs };
