var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const methodOverride = require("method-override");
const flash = require("connect-flash");
var cors = require("cors");

const dashboardRouter = require("./app/dashboard/router");
const categoryRouter = require("./app/category/router");
const nominalRouter = require("./app/nominal/router");
const voucherRouter = require("./app/voucher/router");
const bankRouter = require("./app/bank/router");
const paymentRouter = require("./app/payment/router");
const usersRouter = require("./app/users/router");
const transactionRouter = require("./app/transaction/router");
const playerRouter = require("./app/player/router");
const authRouter = require("./app/auth/router");
const sessionMiddleware = require("./app/middleware/sessionMiddleware");

const app = express();
const URL = `/api/v1`;

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware order is important
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Configure CORS before session
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Session must be after CORS and before routes
app.use(sessionMiddleware);
app.use(flash());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/adminlte",
  express.static(path.join(__dirname, "/node_modules/admin-lte/"))
);

app.use("/", usersRouter);
app.use("/dashboard", dashboardRouter);
app.use("/category", categoryRouter);
app.use("/nominal", nominalRouter);
app.use("/voucher", voucherRouter);
app.use("/bank", bankRouter);
app.use("/payment", paymentRouter);
app.use("/transaction", transactionRouter);

// api
app.use(`${URL}/players`, playerRouter);
app.use(`${URL}/auth`, authRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
