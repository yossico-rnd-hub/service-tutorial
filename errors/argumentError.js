/**
 * Defines an @see ArgumentError.
 */
module.exports = class ArgumentError extends Error{

    /**
     * Creates a new @see ArgumentError.
     * @param {String} argumentName The name of the argument.
     */
    constructor(argumentName){
        super("Provided argument is undefined or NULL");

        this.name = this.constructor.name;

        this.argumentName = argumentName;
    }
}