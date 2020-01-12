const AbstractMethodCallError = require("../errors/abstractMethodCallError");

/**
 * A locker interface.
 */
module.exports = class Locker {
    constructor() {
        if (this.constructor === Locker)
            throw new AbstractMethodCallError();
    }

    /**
     * lock a resource by id.
     * @param {String} resourceId 
     * @param {Number} ttl - time to live in ms.
     * @returns {Promise<String>} returns a promise containing a token (a random string to be used in later calls).
     */
    lock(resourceId, ttl) {
        throw new AbstractMethodCallError();
    }

    /**
     * unlock a resource by id.
     * @param {String} resourceId 
     * @param {String} token - a random string return from calling lock.
     * @returns {Promise<Boolean>} returns a promise designating success/failure.
     */
    unlock(resourceId, token) {
        throw new AbstractMethodCallError();
    }

    /**
     * 
     * @param {String} resourceId
     * @param {String} token - a random string return from calling lock.
     * @param {Number} ttl - time to live in ms.
     * @returns {Promise<Boolean>} returns a promise designating success/failure.
     */
    renewLockLease(resourceId, token, ttl) {
        throw new AbstractMethodCallError();
    }

    /**
     * is resource locked by id.
     * @param {String} resourceId
     * @returns {Promise<Boolean>} returns a promise designating locked state.
     */
    isLocked(resourceId) {
        throw new AbstractMethodCallError();
    }
}
