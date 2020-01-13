// Require dependencies.

const container = require("kontainer-di");
const config = require("config");
const Logger = require("../logger");
const Redis = require("ioredis-mock");

const RedisLocker = require("../services/redisLocker");

// Export the container instance.
module.exports.container = container;
module.exports.configureContainer = configureContainer;
module.exports.resetContainer = resetContainer;

function resetContainer(){
    container.reset();
}

function configureContainer(){
    // Regiter configuration.
    container.register("redisConfig",[], config.redis);
    container.register("loggerConfig",[], config.logger);
    container.register("swaggerConfig",[], config.swagger);

    // Register dependencies.
    container.register("logger",[], Logger);
    container.register("redis", [], new Redis());
    container.register("locker",["redis"], RedisLocker);

    // Start the services (calls the 'start' function of each service if defined).
    container.startAll();
}