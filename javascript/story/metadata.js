/**
 * A metadata class describing metadata information of a data story.
 */
class Metadata {
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
         * Object of interested data fields, and their type: {<field name>: <field type>}.
         * @private
         * @type {Object}
         */
        this.interests = [];
        /**
         * Array of data field dependencies.
         * Array member type is Object {"independent" : ..., "dependent": ...}.
         * @private
         * @type {Array}
         */
        this.dependencies = [];
        /**
         * Array of interesting features determined during data analysis.
         * Array member type is Feature.
         * @private
         * @type {Array}
         */
        this.features = [];
    }

    /**
     * Appends a new field of interest to the array.
     * @param {string} newField 
     */
    appendField(newField){
        this.interests.push(newField);
    }

    /**
     * Appends a new Feature.
     * to the array.
     * @param {Object} newFeature
     */
    appendFeature(newFeature){
        this.features.push(newFeature);
    }

    setAuthor(){

    }

    setTitle(){

    }
}

class Feature {
    /**
     * Initialises class properties;
     * @param {string} header1
     * @param {string} header2
     * @param {string} chart
     * @param {Array} features
     */
    constructor(header1, header2, chart, features ){
        this.header1 = header1;
        this.header2 = header2;
        this.chart = chart;
        this.features = features;
    }

}