import express from "express";
import bodyParser from "body-parser";
import { router } from "./routes.js";
import { connection } from "./database.js";
import { default as session } from "express-session";
import { default as cookieParser } from "cookie-parser";
import MySQLStore from "express-mysql-session";

const port = process.env.HNAPP_PORT || 9898;
const host = process.env.HNAPP_HOST || "localhost";

const app = express();
const sessionStore = new MySQLStore({}, connection);

app.all("*", (_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.HNAPP_SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: { secure: false, maxAge: 60000 },
  })
);
app.use(cookieParser());
app.use(router);

app.listen(port, host, () => {
  console.log(`Signup sercive started on http://localhost:${port}`);
});
