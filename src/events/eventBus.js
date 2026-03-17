const EventEmitter = require("events");
const eventBus = new EventEmitter();

eventBus.on("user.created", (user) => {
  console.log("User created:", user);
});

module.exports = eventBus;