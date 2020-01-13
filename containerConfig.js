// Require dependencies.

const container = require("kontainer-di");
const config = require("config");
const Logger = require("./logger");
const RedisLocker = require("./services/redisLocker");
const Redis = require("ioredis");

// Export the container instance.
module.exports = container;

// Regiter configuration.
container.register("redisConfig",[], config.redis);
container.register("loggerConfig",[], config.logger);
container.register("swaggerConfig",[], config.swagger);

// Register dependencies.
container.register("logger",[], Logger);
container.register("redis", [], new Redis(config.redis));
container.register("locker",["redis"], RedisLocker);

// Start the services (calls the 'start' function of each service if defined).
container.startAll();