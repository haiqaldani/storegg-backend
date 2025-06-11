const session = require("express-session");

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "keyboard cat",
  resave: false,
  saveUninitialized: true,
  name: 'storegg_session',
  cookie: {
    httpOnly: true,
    secure: false, // Set to false to work on HTTP and HTTPS
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax'
  },
});

module.exports = sessionMiddleware;