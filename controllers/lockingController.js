// dependencies.
const HttpCodes = require("http-status-codes");

/**
 * Gets locked resource status by id.
 * @param {*} req http request.
 * @param {*} res http response.
 * @param {*} next Calls the next middleware (if any).
 * @returns {Promise<void>}
 */
module.exports.getLockedResourceByIdAsync = async (request, response, next) => {
    // Get the parameters provided to the rest api.
    let resourceId = request.swagger.params.resourceId.value;

    // Call bussiness logic.
    let responseObj = {
        resourceId: resourceId,
        lockType: "readLock",
        ttl: 10000
    };

    // Set status code, and end the request.
    _sendResponse(response, HttpCodes.OK, responseObj);
}

/**
 * Tries to lock a resource by id.
 * @param {*} request An object describing the request.
 * @param {*} response An object describing the response.
 * @param {*} next Calls the next middleware (if any).
 * @returns {Promise<void>}
 */
module.exports.tryLockResourceByIdAsync = async (request, response, next) => {

    try {
        // Get the parameters provided to the rest api.
        let resourceId = request.swagger.params.resourceId;

        // Call bussiness logic.
        let lockId = "some lock id";

        _sendResponse(response, HttpCodes.OK, lockId);
    }
    catch (error) {
        // Respond with error.
    }
}

/**
 * Tries to renew a lock lease by lock id.
 * @param {*} request An object describing the request.
 * @param {*} response An object describing the response.
 * @param {*} next Calls the next middleware (if any).
 * @returns {Promise<void>}
 */
module.exports.tryRenewLockLease = async (request, response, next) => {

    try {
        // Get the parameters provided to the rest api.
        let lockId = request.swagger.params.lockId;


        _sendResponse(response, HttpCodes.OK);
    }
    catch (error) {
        // Respond with error.
    }
}

/**
 * Tries to unlock a resource by lock id.
 * @param {*} request An object describing the request.
 * @param {*} response An object describing the response.
 * @param {*} next Calls the next middleware (if any).
 * @returns {Promise<void>}
 */
module.exports.tryUnlockResourceByIdAsync = async (request, response, next) => {
    try{
        // Get the parameters provided to the rest api.
        let lockId = request.swagger.params.lockId;


        _sendResponse(response, HttpCodes.OK);
    }
    catch(error){
        // Respond with error.
    }
}

function _sendResponse(response, statusCode, value){
        // Set status code, and end the request.
        response.statusCode = statusCode;
        response.setHeader("Content-Type", "application/json");
        response.end(JSON.stringify(value));
}
