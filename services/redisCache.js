const ArgumentError = require("../errors/argumentError.js");

/**
 * An implementation of caching functionality for redis.
 */
module.exports = class RedisCache {
    
    /**
     * Creates a new @type {RedisCache} instance.
     * @param {*} redisConfig The redis configuration.
     */
    constructor(redisConfig){
        if(!redisConfig)
            throw new ArgumentError("redisConfig");
            
        this._redisConfig = redisConfig;
    }

    

}