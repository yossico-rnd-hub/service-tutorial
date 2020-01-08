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
            throw new TypeError("Invalid argument type: redisConfig.");
            
        this._redisConfig = redisConfig;
    }

    

}