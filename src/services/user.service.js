class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  createUser(data) {
    return this.userRepository.create(data);
  }

  getUsers() {
    return this.userRepository.findAll();
  }
}

module.exports = UserService;