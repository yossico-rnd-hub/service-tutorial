const container = require("kontainer-di");
const config = require("config");
const logger = require("winston");

module.exports = container;

// Register dependencies.

// Regiter configuration.
container.register("redisConfig",[], config.redis);
container.register("loggerConfig",[], config.logger);
container.register("swaggerConfig",[], config.swagger);

// Register services.
container.register("logger",[], logger);





// Start the services (calls the 'start' function of a service if defined).
container.startAll();