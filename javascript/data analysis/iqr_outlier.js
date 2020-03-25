/**
 * A function to identify and extract outliers using an Inter-Quartile Range (IQR), most commonly used to generate boxplots.
 * Based on code by: James Peterson, https://stackoverflow.com/questions/20811131/javascript-remove-outlier-from-an-array
 * 2013
 * @param {Array} someArray - array of number values
 * @returns {Array} outlierValues - outlier values that are outside the calculated range
 */
function getIQROutliers(someArray){
    // Copy the values, rather than operating on references to existing values
    var values = someArray.concat();

    // Then sort
    values.sort( function(a, b) {
            return a - b;
         });

    /* Then find a generous IQR. This is generous because if (values.length / 4)
     * is not an int, then really you should average the two elements on either
     * side to find q1.
     */
    var q1 = values[Math.floor((values.length / 4))];
    // Likewise for q3.
    var q3 = values[Math.ceil((values.length * (3 / 4)))];
    var iqr = q3 - q1;

    // Then find min and max values
    var maxValue = q3 + iqr*1.5;
    var minValue = q1 - iqr*1.5;

    // Then filter anything beyond or beneath these values.
    var outlierValues = values.filter(function(x) {
        return (x > maxValue) || (x < minValue);
    });

    // Then return
    return outlierValues;
}