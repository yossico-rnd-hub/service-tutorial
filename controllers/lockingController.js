// dependencies.
const HttpCodes = require("http-status-codes");

/**
 * Gets locked resource status by id.
 * @param {*} req http request.
 * @param {*} res http response.
 * @param {*} next Calls the next middleware (if any).
 * @returns {Promise<void>}
 */
async function getIsLockedByResourceId(req, res, next) {

    // Get the parameters provided to the rest api.
    let resourceId = req.swagger.params.id;

    // Call bussiness logic.
    let result = true;

    // Set status code & end the request.
    res.statusCode = HttpCodes.OK;
    res.end(JSON.stringify(result));
}

// Export controller functions to be visible by swagger router.
module.exports.getIsLockedByResourceId = getIsLockedByResourceId;
