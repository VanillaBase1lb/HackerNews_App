import express from "express";
import bodyParser from "body-parser";
import { router } from "./routes.js";
import { default as session } from "express-session";
import { default as cookieParser } from "cookie-parser";

const port = process.env.HNAPP_PORT || 9898;
const host = process.env.HNAPP_HOST || "localhost";

const app = express();
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.HNAPP_SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 60000 },
  })
);
app.use(cookieParser());
app.use(router);

app.listen(port, host, () => {
  console.log(`Server started on port ${port}`);
});
