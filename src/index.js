const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const userAlreadyExists = users.find((user) => user.username == username);

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

  return response.status(201).json(todo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const todoUpdate = user.todos.find((todo) => todo.id === id);

  if(!todoUpdate) {
    return response.status(404).json({ error: "Todo not found!!" });
  }

  todoUpdate.title = title;
  todoUpdate.deadline = new Date(deadline);

  return response.status(201).json(todoUpdate);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todoDone = user.todos.find((todo) => todo.id === id);

  if(!todoDone) {
    return response.status(404).json({ error: "Todo not found!!" });
  }

  todoDone.done = true;

  return response.status(201).json(todoDone);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todoDelete = user.todos.find((todo) => todo.id === id);

  if(!todoDelete) {
    return response.status(404).json({ error: "Todo not found!!" });
  }

  user.todos.splice(todoDelete, 1);

  return response.status(204).send();
});

module.exports = app;
