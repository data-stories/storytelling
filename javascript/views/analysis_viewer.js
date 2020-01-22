function analysisViewInit(){

    //var tempCharts = createTempCharts();
    //visualiseCharts(tempCharts);

    var headerPairs = getPairs(Story.instance.data.headers);

    headerPairs.forEach(function(pair){
        if(isInteresting(pair[0], pair[1])){
            //TODO Display interesting pair chart


            makeChart();

            //TODO: add a <p> explaining why the chart is interesting, etc.
        }
    });
}

function analysisViewLeave(){
  
}


function getPairs(array){
    var pairs = [];
    for(let i = 0; i < array.length-1; i++){
        for(let j = i+1; j < array.length; j++){
            pairs.push([array[i], array[j]]);    
        }
    }
    return pairs;
}


function isInteresting(header1, header2){

    var col1 = Story.instance.data.getColumn(header1);
    var col2 = Story.instance.data.getColumn(header2);

    console.log(header1+"/"+header2);


    var chartType;

    //At least one column contains datetime data
    if(col1[0] instanceof Date || col2[0] instanceof Date){
        chartType = "line";

        //TODO: test for trends

        //TODO: test for outliers/peaks/troughs

    }
    //Both columns are numeric data
    else if(!(col1[0] instanceof Date) && !isNaN(col1[0]) && !(col2[0] instanceof Date) && !isNaN(col2[0])){
        chartType = "scatter";

        //Test for correlation
        console.log(getPearsonCorrelation(col1, col2));

        //Test for clusters
        getClusters(col1, col2);
    }
    else{
        chartType = "bar";
        //TODO: Other "interesting"ness checks
    }

}


function getClusters(xCol, yCol){

    //TODO: ensure cols are same length?

    var pointData = [];
    xCol.forEach(function(d, index){
        pointData.push(
        {
            x: xCol[index],
            y: yCol[index]
        })
    });

    //TODO: eps needs to be detected such that it gives (relatively) sensible clusters

    // Configure a DBSCAN instance.
    var dbscanner = jDBSCAN().eps(7000).minPts(1).distance('EUCLIDEAN').data(pointData);
    var point_assignment_result = dbscanner();
    console.log(point_assignment_result);

    console.log("There are approximately "+Math.max(...point_assignment_result)+" distinct clusters in this data");
}

function makeChart(){

    var chart = new Chart();
    chart.setType(chartType);
    var x = [];
    var y = [];
    Story.instance.data.parsedData.forEach(function(datum) {
        x.push(datum[independentField]);
        y.push(datum[dependentField]);
    });
    // calculate the average value of each x
    if (chartType == "bar") {
        var x_unique_sum = {};
        var x_unique_size = {};
        for (var j = 0; j < x.length; j++) {
          var y_value = parseFloat(y[j]);
          if (x[j] in x_unique_sum) {
            x_unique_sum[x[j]] += y_value;
            x_unique_size[x[j]] += 1;
          } else {
            x_unique_sum[x[j]] = y_value;
            x_unique_size[x[j]] = 1;
          }
        }
        x = [];
        y = [];
        for (var k in x_unique_sum) {
            x.push(k);
            y.push(x_unique_sum[k] / x_unique_size[k]);
        }
    }

    chart.setX(x);
    chart.setXLabel(independentField);
    chart.setY(y);
    chart.setYLabel(dependentField);
    chart.setTitle(
    dependentField.charAt(0).toUpperCase() +
      dependentField.slice(1) +
      " vs " +
      independentField
    );

    return chart;
}