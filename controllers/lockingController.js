// Require dependencies.

const HttpCodes = require("http-status-codes");

/**
 * Gets locked resource status by id.
 * @param {*} request An object describing the request.
 * @param {*} response An object describing the response.
 * @param {*} next Calls the next middleware (if any).
 * @returns {Promise<void>}
 */
async function getLockedResourceByIdAsync(request, response, next){

    // Get the parameters provided to the rest api.
    let resourceId = request.swagger.params.id;

    // Call bussiness logic.
    let result = true;

    // Set status code, and end the request.
    response.statusCode = HttpCodes.OK;
    response.end(JSON.stringify(result));
}


// Export controller functions to be visible by swagger router.
module.exports.getLockedResourceByIdAsync = getLockedResourceByIdAsync;