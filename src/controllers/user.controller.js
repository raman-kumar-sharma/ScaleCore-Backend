class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  createUser = (req, res) => {
    const user = this.userService.createUser(req.body);
    res.json(user);
  };

  getUsers = (req, res) => {
    const users = this.userService.getUsers();
    res.json(users);
  };
}

module.exports = UserController;