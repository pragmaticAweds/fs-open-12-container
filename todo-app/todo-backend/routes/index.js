const express = require("express");
const router = express.Router();

const redis = require("../redis");
const configs = require("../util/config");

let visits = 0;

/* GET todo. */
router.get("/statistics", async (req, res) => {
  const todoCounter = await redis.getAsync("added_todos");

  res.send({ added_todos: todoCounter });
});

/* GET index data. */
router.get("/", async (req, res) => {
  visits++;

  res.send({
    ...configs,
    visits,
  });
});

module.exports = router;
