/**
 * A metadata class describing metadata information of a data story.
 */
class Metadata{
    /**
     * Initialises class properties;
     * @param {string} author
     * @param {string} title 
     * @param {string} type 
     */
    constructor(title, author, type){
        /**
         * Author of story.
         * @private
         * @type {string}
         */
        this.author = author
        /**
         * Title of story.
         * @private
         * @type {string}
         */
        this.title = title;
        /**
         * Type of story.
         * @private
         * @type {string}
         */
        this.type = type;
        /**
         * Array of interested data fields.
         * Array member type is string.
         * @private
         * @type {Array}
         */
        this.interests = [];
        /**
         * Array of data field dependencies.
         * Array member type is Object {"independent" : ..., "dependent": ...}.
         * @private
         * @type {Array}
         */
        this.dependencies = [];
    }

    /**
     * Appends a new field of interest to the array.
     * @param {string} newField 
     */
    appendField(newField){
        this.interests.push(newField);
    }

    /**
     * Appends a new dependency Object {"independent" : ..., "dependent": ...}.
     * to the array.
     * @param {Object} newDependency 
     */
    appendDependency(newDependency){
        this.dependencies.push(newDependency);
    }

    setAuthor(){

    }

    setTitle(){

    }
}
