const express = require("express");
const app = express();
const { Todo } = require("./models"); //for doing any operations on todo we should import models
const bodyParser = require("body-parser"); //for parsing from/to json
const path = require("path");

app.use(bodyParser.json());
app.set("view engine", "ejs"); //setting up engine to work with ejs

app.get("/", async (request, response) => {
  const allTodo = await Todo.getTodos();
  if (request.accepts("html")) {
    //request from web i.e. it accepts html   but for postman it accepts json that is in else part
    response.render("index", {
      allTodo,
    });
  } else {
    //for postman like api  we should get json format as it donot support html
    response.json({ allTodo });
  }
});
app.use(express.static(path.join(__dirname, "public")));

app.get("/todos", async (request, response)=> {
  //getting todos from server
  console.log("Processing list of all Todos ...");
  // FILL IN YOUR CODE HERE
  try {
    const todos = await Todo.findAll();
    return response.send(todos);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }

  // First, we have to query our PostgerSQL database using Sequelize to get list of all Todos.
  // Then, we have to respond with all Todos, like:
  // response.send(todos)
});

app.get("/todos/:id", async (request, response)=> {
  //async for getting req
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async  (request, response)=> {
  //posting todos to server
  try {
    const todo = await Todo.addTodo(request.body);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async function (request, response) {
  //for this router the todo at specific id should be marked as complete
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo); // as markascompleted func returns the todo instance we should send it as response
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  // FILL IN YOUR CODE HERE
  try {
    var c = await Todo.destroy({
      //as this function return the number of rows delted do we can check if >0 we can delete it
      where: {
        id: request.params.id,
      },
    });
    response.send(c > 0); ///return bool value true if c>0 else false
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }

  // First, we have to query our database to delete a Todo by ID.
  // Then, we have to respond back with true/false based on whether the Todo was deleted or not.
  // response.send(true)
});

module.exports = app;
