const { sign } = require("../utils/jwt");
const crypto = require("crypto");
const eventBus = require("../events/eventBus");

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async register(data) {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) throw new Error("Email already in use");
    const user = await this.userRepository.create(data);
    eventBus.emit("user.registered", user);
    return user;
  }

  async login(email, password) {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !(await user.comparePassword(password)))
      throw new Error("Invalid credentials");
    if (!user.isActive) throw new Error("Account is deactivated");
    const token = sign({ id: user._id, role: user.role });
    eventBus.emit("user.loggedIn", user);
    return { token, user: { id: user._id, username: user.username, email: user.email, role: user.role } };
  }

  async updatePassword(userId, currentPassword, newPassword) {
    const user = await this.userRepository.findById(userId);
    if (!user || !(await user.comparePassword(currentPassword)))
      throw new Error("Current password is incorrect");
    user.password = newPassword;
    await user.save();
    eventBus.emit("user.passwordUpdated", user);
  }

  async forgotPassword(email) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error("No account with that email");
    const token = crypto.randomBytes(32).toString("hex");
    await this.userRepository.updateById(user._id, {
      resetPasswordToken: token,
      resetPasswordExpires: Date.now() + 3600000,
    });
    eventBus.emit("user.forgotPassword", { email, token });
    return token;
  }

  async resetPassword(token, newPassword) {
    const user = await this.userRepository.findByResetToken(token);
    if (!user) throw new Error("Invalid or expired reset token");
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    eventBus.emit("user.passwordReset", user);
  }

  async updateEmail(userId, newEmail) {
    const existing = await this.userRepository.findByEmail(newEmail);
    if (existing) throw new Error("Email already in use");
    return this.userRepository.updateById(userId, { email: newEmail });
  }

  async updateUsername(userId, newUsername) {
    const existing = await this.userRepository.findByUsername(newUsername);
    if (existing) throw new Error("Username already taken");
    return this.userRepository.updateById(userId, { username: newUsername });
  }

  async updateProfile(userId, data) {
    const allowed = {};
    if (data.dob) allowed.dob = data.dob;
    if (data.gender) allowed.gender = data.gender;
    if (data.profilePicture) allowed.profilePicture = data.profilePicture;
    return this.userRepository.updateById(userId, allowed);
  }

  getProfile(userId) {
    return this.userRepository.findById(userId);
  }
}

module.exports = UserService;
