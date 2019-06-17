/**
 * A Data class describing the used data of a story.
 */
class Data {
  /**
   * Initialises properties of Data class.
   * Parameter rawData is a resulting JavaScript array returned by d3.csvParse().
   * Each array member is an object and represents a row (except header row) of a csv file.
   * The format of each row is as : {"column_1": value_1, "column_2", value_2, ...}.
   * @param {Array} rawData 
   */
  constructor(rawData) {
    /**
     * The raw data in csv format.
     * @private
     * @type {Array}
     */
    this.rawData = rawData;
    /**
     * The header of the raw csv file.
     * @private
     * @type {Array}
     */
    this.headers = Object.keys(rawData[0]);
  }


  detectTrends(){
      throw new Error("Not Implemented")
  }

  detectSpikes(){
      throw new Error("Not Implemented")
  }

  recommendCharts(){
      throw new Error("Not Implemented")
  }

  recommendStructure(){
      throw new Error("Not Implemented")
  }
}