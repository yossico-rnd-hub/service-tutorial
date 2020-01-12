/**
 * A locker interface.
 */
module.exports = class Locker {
    constructor() {
        if (this.constructor === Locker)
            throw new Error('Cannot instanciate abstract class');
    }

    /**
     * lock a resource by id.
     * @param {String} resourceId 
     * @param {Number} ttl - time to live in ms.
     * @returns {Promise<String>} returns a promise containing a token (a random string to be used in later calls).
     */
    lock(resourceId, ttl) {
        throw new Error('Cannot instanciate abstract class');
    }

    /**
     * unlock a resource by id.
     * @param {String} resourceId 
     * @param {String} token - a random string return from calling lock.
     * @returns {Promise} returns a promise designating success/failure.
     */
    unlock(resourceId, token) {
        throw new Error('Cannot instanciate abstract class');
    }

    /**
     * 
     * @param {String} resourceId
     * @param {String} token - a random string return from calling lock.
     * @param {Number} ttl - time to live in ms.
     * @returns {Promise} returns a promise designating success/failure.
     */
    renewLockLease(resourceId, token, ttl) {
        throw new Error('Cannot instanciate abstract class');
    }

    /**
     * is resource locked by id.
     * @param {String} resourceId
     * @returns {Promise} returns a promise designating locked state (true/false).
     */
    locked(resourceId) {
        throw new Error('Cannot instanciate abstract class');
    }
}
