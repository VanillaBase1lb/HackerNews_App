import express from "express";
import { connection } from "./database.js";

export const router = express.Router();

router.post("/create", (req, res) => {
  if (!req.session.username) {
    res.status(401).send({ error: "Could not create bookmark" });
    return;
  }
  const { id } = req.body;
  connection.query(
    "INSERT INTO bookmarks (username, id) VALUES (?, ?)",
    [req.session.username, id],
    (err, _) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          res.status(400).send({ error: "Could not create bookmark" });
          return;
        }
        console.log(err);
        res.status(500);
      } else {
        res.status(200).send({ message: "Bookmark created" });
      }
    }
  );
});

router.get("/fetch", (req, res) => {
  if (!req.session.username) {
    res.status(401).send({ error: "Could not fetch bookmark" });
    return;
  }
  connection.query(
    "SELECT id FROM bookmarks WHERE username = ?",
    [req.session.username],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500);
      } else {
        res.status(200).send(results);
      }
    }
  );
});

router.post("/delete", (req, res) => {
  if (!req.session.username) {
    res.status(401).send({ error: "Could not fetch bookmark" });
    return;
  }
  const { id } = req.body;
  connection.query(
    "DELETE FROM bookmarks WHERE username = ? AND id = ?",
    [req.session.username, id],
    (err, _) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          res.status(400).send({ error: "Could not delete bookmark" });
          return;
        }
        console.log(err);
        res.status(500);
      } else {
        res.status(200).send({ message: "Bookmark deleted" });
      }
    }
  );
});
