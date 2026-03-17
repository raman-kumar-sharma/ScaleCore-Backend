const express = require("express");

function userRoutes(userController) {
  const router = express.Router();

  router.post("/", userController.createUser);
  router.get("/", userController.getUsers);

  return router;
}

module.exports = userRoutes;