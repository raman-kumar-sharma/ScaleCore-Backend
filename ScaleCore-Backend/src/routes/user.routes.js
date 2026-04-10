const express = require("express");
const { authenticate } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

function userRoutes(userController) {
  const router = express.Router();

  // Auth
  router.post("/register", upload.single("profilePicture"), userController.register);
  router.post("/login", userController.login);
  router.post("/forgot-password", userController.forgotPassword);
  router.post("/reset-password", userController.resetPassword);

  // Profile (protected)
  router.get("/profile", authenticate, userController.getProfile);
  router.put("/profile", authenticate, upload.single("profilePicture"), userController.updateProfile);
  router.patch("/profile/username", authenticate, userController.updateUsername);
  router.patch("/profile/email", authenticate, userController.updateEmail);
  router.patch("/profile/password", authenticate, userController.updatePassword);

  return router;
}

module.exports = userRoutes;
