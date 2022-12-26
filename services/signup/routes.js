import express from "express";
import * as crypto from "crypto";
import { connection } from "./database.js";

export const router = express.Router();

// create a signup route
router.post("/signup", (req, res) => {
  const { username, password } = req.body;
  // hash the password with a random salt
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  connection.connect((err) => {
    // check if username already exists
    connection.query(
      "SELECT COUNT (*) FROM users WHERE username = ?",
      [username],
      (err, results) => {
        if (err) {
          console.log(err);
          res.status(500);
        } else if (results[0]["COUNT (*)"] > 0) {
          console.log(results);
          res.status(400).send({ error: "Username already exists" });
        } else {
          // insert the new user if they do not exist yet
          connection.query(
            "INSERT INTO users (username, password_hash, salt) VALUES (?, ?, ?)",
            [username, hash, salt],
            (err, _) => {
              if (err) {
                console.log(err);
                res.status(500);
              } else {
                // console.log(username, hash, salt);
                res
                  .status(200)
                  .send({ message: "User created", username: username });
              }
            }
          );
        }
      }
    );
  });
});

// create a signup route
router.post("/login", (req, res) => {
  if (req.session.username) {
    res.status(400).send({ error: "Already logged in" });
    return;
  }
  const { username, password } = req.body;
  connection.connect((err) => {
    // check if username already exists
    connection.query(
      "SELECT * FROM users WHERE username = ?",
      [username],
      (err, results) => {
        if (err) {
          console.log(err);
          res.status(500);
        } else if (results.length === 0) {
          console.log(results);
          res.status(400).send({ error: "Username does not exist" });
        } else {
          // compare the password hash with the stored hash
          const hash = crypto
            .pbkdf2Sync(password, results[0].salt, 1000, 64, "sha512")
            .toString("hex");
          if (hash === results[0].password_hash) {
            req.session.username = username;
            res
              .status(200)
              .send({ message: "User logged in", username: username });
          } else {
            res.status(400).send({ error: "Incorrect password" });
          }
        }
      }
    );
  });
});

router.get("/logout", (req, res) => {
  if (!req.session.username) {
    res.status(400).send({ error: "Not logged in" });
    return;
  }
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.status(500);
    } else {
      res.status(200).send({ message: "User logged out" });
    }
  });
});
