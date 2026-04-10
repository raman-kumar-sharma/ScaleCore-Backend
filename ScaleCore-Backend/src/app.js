const express = require("express");
const path = require("path");
const cors = require("cors");
const createContainer = require("./container/container");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174"], credentials: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const container = createContainer();

app.use("/api/users", userRoutes(container.userController));
app.use("/api/admin", adminRoutes(container.adminController));

module.exports = app;
