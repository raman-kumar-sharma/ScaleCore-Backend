const UserRepository = require("../repositories/user.repository");
const UserService = require("../services/user.service");
const UserController = require("../controllers/user.controller");
const AdminService = require("../services/admin.service");
const AdminController = require("../controllers/admin.controller");

function createContainer() {
  const userRepository = new UserRepository();

  const userService = new UserService(userRepository);
  const userController = new UserController(userService);

  const adminService = new AdminService(userRepository);
  const adminController = new AdminController(adminService);

  return { userController, adminController };
}

module.exports = createContainer;
