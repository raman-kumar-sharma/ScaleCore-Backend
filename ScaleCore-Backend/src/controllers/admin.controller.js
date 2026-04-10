const { success, error } = require("../utils/response");

class AdminController {
  constructor(adminService) {
    this.adminService = adminService;
  }

  getUsers = async (req, res) => {
    try {
      const users = await this.adminService.getAllUsers();
      success(res, users);
    } catch (err) {
      error(res, err.message);
    }
  };

  toggleUserStatus = async (req, res) => {
    try {
      const user = await this.adminService.toggleUserStatus(req.params.id);
      success(res, user);
    } catch (err) {
      error(res, err.message);
    }
  };

  deleteUser = async (req, res) => {
    try {
      await this.adminService.deleteUser(req.params.id);
      success(res, { message: "User deleted" });
    } catch (err) {
      error(res, err.message);
    }
  };
}

module.exports = AdminController;
