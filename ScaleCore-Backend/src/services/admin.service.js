const eventBus = require("../events/eventBus");

class AdminService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  getAllUsers() {
    return this.userRepository.findAll();
  }

  async toggleUserStatus(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error("User not found");
    const updated = await this.userRepository.updateById(userId, {
      isActive: !user.isActive,
    });
    eventBus.emit("admin.userStatusToggled", updated);
    return updated;
  }

  async deleteUser(userId) {
    const user = await this.userRepository.deleteById(userId);
    if (!user) throw new Error("User not found");
    eventBus.emit("admin.userDeleted", user);
  }
}

module.exports = AdminService;
