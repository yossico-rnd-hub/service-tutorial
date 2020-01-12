// dependencies.
const HttpCodes = require("http-status-codes");
const container = require("../containerConfig");
const locker = container.get("locker");
const logger = container.get("logger");

/**
 * Gets whether the requested resource is locked, by resource id.
 * @param {*} req http request.
 * @param {*} res http response.
 * @param {*} next Calls the next middleware (if any).
 * @returns {Promise<void>}
 */
module.exports.getIsLockedByResourceIdAsync = async (request, response, next) => {
    // Get the parameters provided to the rest api.
    let resourceId = request.swagger.params.resourceId.value;

    try {
        // Call bussiness logic.
        let isLocked = await locker.isLocked(resourceId);

        // Set status code, and end the request.
        _sendResponse(response, HttpCodes.OK, isLocked);
    } catch (error) {
        _sendErrorResponse(response, error);
    }
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
        let resourceId = request.swagger.params.resourceId.value;
        let ttl = request.swagger.params.ttl.value;

        // Call bussiness logic.
        let lockToken = await locker.lock(resourceId, ttl);

        _sendResponse(response, HttpCodes.OK, lockToken);
    }
    catch (error) {
        _sendErrorResponse(response, error);
    }
}

/**
 * Tries to renew a lock lease by lock token.
 * @param {*} request An object describing the request.
 * @param {*} response An object describing the response.
 * @param {*} next Calls the next middleware (if any).
 * @returns {Promise<void>}
 */
module.exports.tryRenewLockLease = async (request, response, next) => {

    try {
        // Get the parameters provided to the rest api.
        let renewRequest = request.swagger.params.renewRequest.value;

        // Call bussiness logic.
        let renewed = await locker.renewLease(renewRequest.resourceId, renewRequest.token, renewRequest.ttl);

        _sendResponse(response, HttpCodes.OK, renewed);
    }
    catch (error) {
        // Respond with error.
        _sendErrorResponse(response, error);
    }
}

/**
 * Tries to unlock a resource by lock token.
 * @param {*} request An object describing the request.
 * @param {*} response An object describing the response.
 * @param {*} next Calls the next middleware (if any).
 * @returns {Promise<void>}
 */
module.exports.tryUnlockResourceByIdAsync = async (request, response, next) => {
    try {
        // Get the parameters provided to the rest api.
        let resourceId = request.swagger.params.resourceId.value;
        let lockToken = request.swagger.params.token.value;

        // Call bussiness logic.
        let unlocked = await locker.unlock(resourceId, lockToken);

        _sendResponse(response, HttpCodes.OK, unlocked);
    }
    catch (error) {
        // Respond with error.
        _sendErrorResponse(response, error);
    }
}


function _sendResponse(response, statusCode, value) {
    // Set status code, and end the request.
    response.statusCode = statusCode;
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify(value));
}

function _sendErrorResponse(response, error){

    if (error instanceof TypeError) {
        // Provided parameters were not in the correct format.
        logger.error(error.message, error);
        // Set status code, and end the request.
        _sendResponse(response, HttpCodes.BAD_REQUEST, error.message);
        return;
    }

    // Locker request failed.
    logger.err("Failed to query locker.", error);

    // Set status code, and end the request.
    _sendResponse(response, HttpCodes.INTERNAL_SERVER_ERROR, isLocked);
}