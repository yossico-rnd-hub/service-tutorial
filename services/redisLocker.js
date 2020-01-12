require("./locker")
var Redis = require("ioredis");

/**
 * An implementation of locker functionality for redis.
 */
module.exports = class RedisLocker extends Locker {
    /**
     * Creates a new @type {RedisLocker} instance.
     * @param {*} redisConfig The redis configuration.
     */
    constructor(redisConfig) {
        super();
        if (!redisConfig)
            throw new TypeError("Invalid argument type: redisConfig.");

        // When a new Redis instance is created, a connection to Redis will be created at the same time.
        // By default, ioredis will try to reconnect when the connection to Redis is lost except when the 
        // connection is closed manually by redis.disconnect() or redis.quit().
        this._redis = new Redis({
            port: redisConfig.port,
            host: redisConfig.host
        });
    }

    /**
     * lock a resource by id.
     * @param {String} resourceId 
     * @param {Number} ttl - time to live in ms.
     * @returns {Promise<String></String>} returns a promise containing a token (a random string to be used in later calls).
     */
    lock(resourceId, ttl) {
        // lilo:TODO
        // arguments validation
        if (!(resourceId instanceof String))
            throw TypeError('resourceId should be a string')
        if (!(ttl instanceof Number) || ttl <= 0)
            throw TypeError('ttl should be a number > 0')
        
        this._redis.set(resourceId, token, 'EX', ttl);
    }

    /**
     * unlock a resource by id.
     * @param {String} resourceId 
     * @param {String} token - a random string return from calling lock.
     * @returns {Promise} returns a promise designating success/failure.
     */
    unlock(resourceId, token) {
        // lilo:TODO
    }

    /**
     * 
     * @param {String} resourceId
     * @param {String} token - a random string return from calling lock.
     * @param {Number} ttl - time to live in ms.
     * @returns {Promise} returns a promise designating success/failure.
     */
    renewLockLease(resourceId, token, ttl) {
        // lilo:TODO
    }

    /**
     * is resource locked by id.
     * @param {String} resourceId
     * @returns {Promise} returns a promise designating locked state (true/false).
     */
    locked(resourceId) {
        // lilo:TODO
    }
}

POST https://example.com/comments HTTP/1.1
content-type: application/json

{
    "name": "sample",
    "time": "Wed, 21 Oct 2015 18:27:50 GMT"
}