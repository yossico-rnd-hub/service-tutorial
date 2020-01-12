/**
 * Defines an error that is raised when an abstract method is called.
 */
module.exports = class AbstractMethodCallError extends Error {

    /**
     * Creates a new instance.
     */
    constructor(){
        super("Cannot instanciate abstract class");

        // Set the name of the error.
        this.name = this.constructor.name;
    }
}