const express = require("express");
const createContainer = require("./container/container");
const userRoutes = require("./routes/user.routes");

const app = express();
app.use(express.json());

const container = createContainer();

app.use("/users", userRoutes(container.userController));

module.exports = app;