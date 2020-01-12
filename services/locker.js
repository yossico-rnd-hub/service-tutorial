'use strict';

const AbstractMethodCallError = require(__dirname + '/../errors/abstractMethodCallError');

/**
 * A locker interface.
 */
module.exports = class Locker {
    constructor() {
        if (this.constructor === Locker)
            throw new AbstractMethodCallError();
    }

    /**
     * Lock a resource by id.
     * The lock will be auto-released after the expire time is reached.
     * @param {String} resourceId 
     * @param {Number} ttl - time to live in ms.
     * @returns {Promise<String>} returns a promise containing a token (a random string to be used in later calls).
     */
    lock(resourceId, ttl) {
        throw new AbstractMethodCallError();
    }

    /**
     * Unlock a resource.
     * @param {String} resourceId 
     * @param {String} token - a random string returned from calling lock.
     * @returns {Promise<Boolean>} returns a promise designating success/failure.
     */
    unlock(resourceId, token) {
        throw new AbstractMethodCallError();
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
        throw new AbstractMethodCallError();
    }

    /**
     * Check whther the resource is locked.
     * @param {String} resourceId
     * @returns {Promise<Boolean>} returns a promise designating locked state.
     */
    isLocked(resourceId) {
        throw new AbstractMethodCallError();
    }
}
