/**
 * Environment: name storage
 */
class Environment {
    constructor(record = {}, parent = null) {
        this.record = record;
        this.parent = parent;
    }
    /**
     * create a variable with the given name and value
     */
    define(name, value) {
        this.record[name] = value;
        return value;
    }

    /**
     * assign a variable with the given name and value
     */
    assign(name, value) {
        this.reslove(name).record[name] = value;
        return value;
    }

    /**
     * Returns the value of a defined  variable , or
     * throws if the variable is not defined
     */
    lookup(name) {
        return this.reslove(name).record[name]
    }

    /**
     * Returns the value of a defined  variable , or
     * throws if the variable is not defined
     */
    reslove(name) {
        if(this.record.hasOwnProperty(name)) {
            return this;
        }
        if(this.parent == null) {
            throw new ReferenceError(`variable ${name}  is not defined`);
        }
        return this.parent.reslove(name);
    }
}
module.exports = Environment;