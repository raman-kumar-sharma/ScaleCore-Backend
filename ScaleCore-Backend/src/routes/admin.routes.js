const express = require("express");
const { authenticate, authorizeAdmin } = require("../middlewares/auth.middleware");

function adminRoutes(adminController) {
  const router = express.Router();

  router.use(authenticate, authorizeAdmin);

  router.get("/users", adminController.getUsers);
  router.patch("/users/:id/status", adminController.toggleUserStatus);
  router.delete("/users/:id", adminController.deleteUser);

  return router;
}

module.exports = adminRoutes;
