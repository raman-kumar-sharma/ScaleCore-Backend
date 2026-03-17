const UserRepository = require("../repositories/user.repository");
const UserService = require("../services/user.service");
const UserController = require("../controllers/user.controller");

function createContainer() {
    const userRepository = new UserRepository();
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);

    return { userController };
}

module.exports = createContainer;