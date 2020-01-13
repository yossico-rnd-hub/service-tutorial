'use strict';

var Redis = require('ioredis');

var Locker = require('./locker');

/**
 * An implementation of locker functionality for redis.
 */
module.exports = class RedisLocker extends Locker {
    /**
     * Creates a new @type {RedisLocker} instance.
     * @param {Redis} redis The redis instance.
     */
    constructor(redis) {
        super();

        if (!redis) {
            throw new TypeError("Invalid argument type: redis.");
        }

        // When a new Redis instance is created, a connection to Redis will be created at the same time.
        // By default, ioredis will try to reconnect when the connection to Redis is lost except when the 
        // connection is closed manually by redis.disconnect() or redis.quit().
        this._redis = redis;

        // Define a lock command using Lua script
        this._redis.defineCommand('lock', {
            numberOfKeys: 1,
            lua: `-- function to generate a random uuid
                    local function uuid()
                        local template ='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
                        return string.gsub(template, '[xy]', function (c)
                            local v = (c == 'x') and math.random(0, 0xf) or math.random(8, 0xb)
                            return string.format('%x', v)
                        end)
                    end

                    -- function to generate a token
                    -- retry while token alredy exists
                    local function get_token()
                        local token = uuid()
                        if 0 == redis.call("exists", token) then
                            return token
                        end
                        return get_token()
                    end
                    
                    -- generate a token
                    local token = get_token()

                    -- set key if value (token) not exists
                    redis.call("set", KEYS[1], token, "NX")
                    
                    -- set ttl
                    redis.call("expire", KEYS[1], ARGV[1])

                    -- return token
                    return token`
        });

        // Define a unlock command using Lua script
        this._redis.defineCommand('unlock', {
            numberOfKeys: 1,
            lua: `-- delete the resource only if exists and it's avlue matches token.
                    if redis.call("get", KEYS[1]) == ARGV[1]
                    then
                        return redis.call("del", KEYS[1])
                    else
                        return 0
                    end`
        });
    }

    /**
     * Lock a resource by id.
     * The lock will be auto-released after the expire time is reached.
     * @param {String} resourceId 
     * @param {Number} ttl - time to live in ms.
     * @returns {Promise<String>} returns a promise containing a token (a random string to be used in later calls).
     */
    lock(resourceId, ttl) {
        // arguments validation
        if (typeof resourceId != 'string')
            throw TypeError('(required) resourceId should be a string');

        if (typeof ttl != 'number' || ttl <= 0)
            throw TypeError('(required) ttl should be a number > 0');

        // try to lock the resource
        return this._redis.lock(resourceId, ttl);
    }

    /**
     * Unlock a resource.
     * @param {String} resourceId 
     * @param {String} token - a random string returned from calling lock.
     * @returns {Promise<Boolean>} returns a promise designating success/failure.
     */
    unlock(resourceId, token) {
        // arguments validation
        if (typeof resourceId != 'string')
            throw TypeError('(required) resourceId should be a string');

        if (typeof token != 'string')
            throw TypeError('(required) token should be a string');

        // try to unlock the resource
        return this._redis.unlock(resourceId, token);
    }

    /**
     * Check whether the resource is locked.
     * @param {String} resourceId
     * @returns {Promise<Boolean>} returns a promise designating locked state.
     */
    async isLocked(resourceId) {
        // arguments validation
        if (typeof resourceId != 'string')
            throw TypeError('(required) resourceId should be a string');

        let token = await this._redis.get(resourceId);
        if (token)
            return true;
        return false;
    }

    /**
     * Renew lease.
     * The lock will be auto-released after the expire time is reached.
     * @param {String} resourceId
     * @param {String} token - a random string returned from calling lock.
     * @param {Number} ttl - time to live in ms.
     * @returns {Promise<Boolean>} returns a promise designating success/failure.
     */
    renewLockLease(resourceId, token, ttl) {
        // arguments validation
        if (typeof resourceId != 'string')
            throw TypeError('(required) resourceId should be a string');

        if (typeof token != 'string')
            throw TypeError('(required) token should be a string');

        if (typeof ttl != 'number' || ttl <= 0)
            throw TypeError('(required) ttl should be a number > 0');

        return this._redis.set(resourceId, token, 'ex', ttl);
    }

    /**
     * disconnect from database.
     */
    disconnect() {
        this._redis.disconnect();
    }
}
