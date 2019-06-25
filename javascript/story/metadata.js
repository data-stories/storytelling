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
         * Array member type is Object {"dependent field" : "independent field"}.
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
     * Appends a new dependency string ("dependent field / independent field")
     * to the array.
     * @param {string} newDependency 
     */
    appendDependency(newDependency){
        this.interests.push(newDependency);
    }

    setAuthor(){

    }

    setTitle(){

    }
}
