const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const userAlreadyExists = users.reduce((user) => user.username == username);

  if (!userAlreadyExists) {
    return response.status(400).json({ errors: "User not found!" });
  }

  request.user = userAlreadyExists;

  next();
}

app.post("/users", (request, response) => {
  const { username, name } = request.body;

  const userAlreadyExists = users.some((user) => user.username == username);

  if (userAlreadyExists) {
    return response.status(400).json({ error: "User alredy existis!!" });
  }

  const userRegister = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(userRegister);

  return response.status(201).json(userRegister);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.status(200).json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(todo);

  return response.status(200).json(todo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
