// Require dependencies.

const container = require("kontainer-di");
const config = require("config");
const logger = require("./logger");
const RedisLocker = require("./services/redisLocker");

// Export the container instance.
module.exports = container;

// Regiter configuration.
container.register("redisConfig",[], config.redis);
container.register("loggerConfig",[], config.logger);
container.register("swaggerConfig",[], config.swagger);

// Register logger.
container.register("logger",[], logger);

// Register dependencies.
container.register("locker",["redisConfig"], RedisLocker);

// Start the services (calls the 'start' function of each service if defined).
container.startAll();