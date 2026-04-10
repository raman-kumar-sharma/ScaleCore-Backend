const { success, error } = require("../utils/response");

class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  register = async (req, res) => {
    try {
      const profilePicture = req.file ? req.file.path : null;
      const user = await this.userService.register({ ...req.body, profilePicture });
      success(res, user, 201);
    } catch (err) {
      error(res, err.message);
    }
  };

  login = async (req, res) => {
    try {
      const result = await this.userService.login(req.body.email, req.body.password);
      success(res, result);
    } catch (err) {
      error(res, err.message, 401);
    }
  };

  getProfile = async (req, res) => {
    try {
      const user = await this.userService.getProfile(req.user.id);
      success(res, user);
    } catch (err) {
      error(res, err.message);
    }
  };

  updateProfile = async (req, res) => {
    try {
      const profilePicture = req.file ? req.file.path : undefined;
      const user = await this.userService.updateProfile(req.user.id, {
        ...req.body,
        ...(profilePicture && { profilePicture }),
      });
      success(res, user);
    } catch (err) {
      error(res, err.message);
    }
  };

  updateUsername = async (req, res) => {
    try {
      const user = await this.userService.updateUsername(req.user.id, req.body.username);
      success(res, user);
    } catch (err) {
      error(res, err.message);
    }
  };

  updateEmail = async (req, res) => {
    try {
      const user = await this.userService.updateEmail(req.user.id, req.body.email);
      success(res, user);
    } catch (err) {
      error(res, err.message);
    }
  };

  updatePassword = async (req, res) => {
    try {
      await this.userService.updatePassword(
        req.user.id,
        req.body.currentPassword,
        req.body.newPassword
      );
      success(res, { message: "Password updated" });
    } catch (err) {
      error(res, err.message);
    }
  };

  forgotPassword = async (req, res) => {
    try {
      const token = await this.userService.forgotPassword(req.body.email);
      // In production, send token via email. Returning here for dev.
      success(res, { resetToken: token });
    } catch (err) {
      error(res, err.message);
    }
  };

  resetPassword = async (req, res) => {
    try {
      await this.userService.resetPassword(req.body.token, req.body.newPassword);
      success(res, { message: "Password reset successful" });
    } catch (err) {
      error(res, err.message);
    }
  };
}

module.exports = UserController;
