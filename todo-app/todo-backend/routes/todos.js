const express = require("express");
const { Todo } = require("../mongo");
const { getAsync, setAsync } = require("../redis");
const router = express.Router();

/* GET todos listing. */
router.get("/", async (_, res) => {
  const todos = await Todo.find({});
  res.send(todos);
});

/* POST todo to listing. */
router.post("/", async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  });

  let todoCounter = await getAsync("added_todos");

  if (!todoCounter) await setAsync("added_todos", 1);
  else {
    console.log("Before:", todoCounter);

    todoCounter = +todoCounter + 1;

    console.log("After:", todoCounter);

    await setAsync("added_todos", todoCounter);
  }

  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;
  req.todo = await Todo.findById(id);
  if (!req.todo) return res.sendStatus(404);

  next();
};

/* DELETE todo. */
singleRouter.delete("/", async (req, res) => {
  await req.todo.delete();
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get("/", async (req, res) => {
  res.send(req.todo);
});

/* PUT todo. */
singleRouter.put("/", async (req, res) => {
  const { todo, body } = req;

  if (body.text) todo.text = body.text;
  if (body.done) todo.done = body.done;

  await todo.save();

  res.send(todo);
});

router.use("/:id", findByIdMiddleware, singleRouter);

module.exports = router;
