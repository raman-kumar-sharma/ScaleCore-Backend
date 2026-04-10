const User = require("../models/user.model");

class UserRepository {
  create(data) {
    return User.create(data);
  }

  findAll(filter = {}) {
    return User.find(filter).select("-password -resetPasswordToken -resetPasswordExpires");
  }

  findById(id) {
    return User.findById(id);
  }

  findByEmail(email) {
    return User.findOne({ email });
  }

  findByUsername(username) {
    return User.findOne({ username });
  }

  findByResetToken(token) {
    return User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
  }

  updateById(id, data) {
    return User.findByIdAndUpdate(id, data, { new: true }).select("-password");
  }

  deleteById(id) {
    return User.findByIdAndDelete(id);
  }
}

module.exports = UserRepository;
