// const createError = require("http-errors");
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const swaggerUi = require("swagger-ui-express");
const { specs } = require("./swagger/swagger.js");
// app.set('view engine', 'ejs');

const usersRouter = require("./routes/users");
const productsRouter = require("./routes/products");
const likeRouter = require("./routes/like");
const brandRouter = require("./routes/brand");
const jobRouter = require("./routes/job");
const categoryRouter = require("./routes/category");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/user", usersRouter);
app.use("/product", productsRouter);
app.use("/like", likeRouter);
app.use("/brand", brandRouter);
app.use("/job", jobRouter);
app.use("/category", categoryRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });

module.exports = app;
