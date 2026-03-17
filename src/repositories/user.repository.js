class UserRepository {
  constructor() {
    this.users = [];
  }

  create(user) {
    this.users.push(user);
    return user;
  }

  findAll() {
    return this.users;
  }
}

module.exports = UserRepository;