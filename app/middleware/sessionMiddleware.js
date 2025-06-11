const session = require("express-session");

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "keyboard cat",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.MODE === "production",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
});

module.exports = sessionMiddleware;