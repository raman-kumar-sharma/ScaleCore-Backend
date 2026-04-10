const EventEmitter = require("events");
const eventBus = new EventEmitter();

eventBus.on("user.registered", (user) => console.log("[Event] User registered:", user.email));
eventBus.on("user.loggedIn", (user) => console.log("[Event] User logged in:", user.email));
eventBus.on("user.passwordUpdated", (user) => console.log("[Event] Password updated:", user.email));
eventBus.on("user.forgotPassword", ({ email, token }) => console.log("[Event] Reset token for", email, ":", token));
eventBus.on("user.passwordReset", (user) => console.log("[Event] Password reset:", user.email));
eventBus.on("admin.userStatusToggled", (user) => console.log("[Event] User status toggled:", user.email, "->", user.isActive));
eventBus.on("admin.userDeleted", (user) => console.log("[Event] User deleted:", user.email));

module.exports = eventBus;
