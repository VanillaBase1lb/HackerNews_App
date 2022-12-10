import express from "express";
import bodyParser from "body-parser";
import { router } from "./routes.js";

const port = process.env.HNAPP_PORT || 9898;
const host = process.env.HNAPP_HOST || "localhost";

const app = express();
app.use(bodyParser.json());
app.use(router);

app.listen(port, host, () => {
  console.log(`Server started on port ${port}`);
});
