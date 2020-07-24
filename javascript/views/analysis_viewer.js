var interestingCharts = {};

function analysisViewInit(){

    // If we've already done the analysis, don't do it again
    // if(Object.keys(interestingCharts).length > 0){
    //     return;
    // }
    // Update; do it again after all - what if they've gone back to
    // the data page and changed the dependent/independent variables?
    //
    // TODO: ONLY UPDATE THE USER-SELECTED VARAIBLES THEN - OTHERWISE THIS TAKES FOREVER
    $("#data-analysis").empty();
    interestingCharts = {};
    
    console.log(Object.keys(Story.instance.metadata.interests));

    //Collect interesting features of data-column pairs
    var headerPairs = getPairs(Object.keys(Story.instance.metadata.interests));
    headerPairs.forEach(function(pair){
        interestingFeatures = getInterestingFeatures(pair[0], pair[1]);
        if(interestingFeatures){
            interestingCharts[interestingFeatures.header1.replace(/ /g, "-")+"-"+interestingFeatures.header2.replace(/ /g, "-")] = interestingFeatures
        }
    });

    console.log(headerPairs);

    //Collect features of stand-alone data-columns
    Object.keys(Story.instance.metadata.interests).forEach(header => {
        interestingFeatures = getInterestingFeatures(header);
        if(interestingFeatures){
            interestingCharts[interestingFeatures.header1.replace(/ /g, "-")] = interestingFeatures
        }
    });

    var chartRow;
    var buttonRow;
    var interesting = 0; //Used to alternate between adding rows/columns

    //Sort charts by how interesting they are (prioritising user-selected combinations)
    function sortInterestingCharts(chart1, chart2){
        var user = "You suggested there may be a relationship between these variables";
        console.log();

        if(chart1.features.includes(user) && !chart2.features.includes(user)){
            return -1;
        }
        else if (!chart1.features.includes(user) && chart2.features.includes(user)){
            return 1;
        }
        else{
            return chart2.features.length - chart1.features.length    
        }
    }
    Object.values(interestingCharts).sort((chart1, chart2) => sortInterestingCharts(chart1, chart2)).forEach(interestingFeatures =>{
        interesting++;

        if(interesting % 2 == 1){
            chartRow = $("<div>").attr("class", "row");
            $("#data-analysis").append(chartRow);
            buttonRow = $("<div>").attr("class", "row");
            $("#data-analysis").append(buttonRow);
        }

        var interestID = (interestingFeatures.header2) ? interestingFeatures.header1.replace(/ /g, "-")+"-"+interestingFeatures.header2.replace(/ /g, "-") : interestingFeatures.header1.replace(/ /g, "-");
        var interestingDiv = $("<div>")
            .attr("id", interestID)
            .attr("class", "col-6");// text-center");

        chartRow.append(interestingDiv);

        if(interestingFeatures.header2){
            interestingDiv.append($("<h6>").text(interestingFeatures.header2+"/"+interestingFeatures.header1).attr("class", "text-center"));    
        }
        else{
            interestingDiv.append($("<h6>").text(interestingFeatures.header1).attr("class", "text-center"));
        }
        interestingFeatures.chart.render(d3.select("#"+interestingDiv.attr("id")), 400, 200);
        interestingFeatures.features.forEach(t => {interestingDiv.append($("<p>").text(t))});

        var button = $("<button>")
            .attr("type", "button")
            .attr("class", "btn btn-secondary interesting-data text-center")
            .attr("interest", interestID)
            .attr("data-toggle", "button")
            .attr("aria-pressed", "false")
            .attr("autocomplete", "off")
            .text("Include")
            .click(function(){
                if($(this).hasClass("btn-primary")){
                    $(this).removeClass("btn-primary")
                        .addClass("btn-secondary")
                        .text("Include");
                }
                else{
                    $(this).removeClass("btn-secondary")
                        .addClass("btn-primary")
                        .text("Remove");
                }
            });

        var buttonDiv = $("<div>")
            .attr("class", "col-6 text-center");
        
        buttonDiv.append(button);
        buttonRow.append(buttonDiv);


        Story.instance.metadata.features.forEach(function(feature){

            if(feature.header1 == interestingFeatures.header1 && feature.header2 == interestingFeatures.header2){
                button.click();
                //TODO: break;
            }
        });
        
    });

    if (interesting == 0) {
        $("#data-analysis").append($("<p>No features could be detected at this time</p>"));
    }
}

onPageEnter["analysis"] = analysisViewInit;

function analysisViewLeave(){
    // Add each interesting feature to a NarrativeFeatures array for use by rule-based recommendation system
    // TODO: look at refactoring interestingCharts to use NarrativeFeatures class directly
    $(".interesting-data.active").each(function(index, element){
        var interest = interestingCharts[$(element).attr("interest")];
        var newNarrFeature = new NarrativeFeature(interest.header1, interest.header2, interest.chart, interest.features);
        Story.instance.metadata.features.push(newNarrFeature);
    });

    //If a chart is NOT selected, and is in Story.instance.metadata.features, remove it
    $(".interesting-data:not(.active)").each(function(index, element){
        var interest = interestingCharts[$(element).attr("interest")];
        var i = Story.instance.metadata.features;
        while (i--) {
            if (Story.instance.metadata.features.header1 == interest.header1 && Story.instance.metadata.features.header2 == interest.header2) { 
                Story.instance.metadata.features.splice(i, 1);
            } 
        }
    });

    //TODO: remove the narrative features from the recommendations in the story page (if they haven't been used yet)
}

onPageLeave["analysis"] = analysisViewLeave;

function getPairs(array){
    var pairs = [];
    for(let i = 0; i < array.length-1; i++){
        for(let j = i+1; j < array.length; j++){
            pairs.push([array[i], array[j]]);    
        }
    }
    return pairs;
}


function getInterestingFeatures(header1, header2){

    var interesting  = {header1: header1, header2: header2, chart: null, features: []}

    var col1 = Story.instance.data.getColumn(header1);
    var col2 = Story.instance.data.getColumn(header2);

    //If we're looking at an individual value
    if(!header2){
        interesting.header2 = null //Make it specifically null rather than undefined

        //TODO: for now, we'll make a special case that category data is interesting, to demonstrate
        //the possibilities; later we can implement a threshold for "actually" interesting categories

        if(Story.instance.metadata.interests[header1] === "string"){
            data = {};
            col1.forEach(datum => {
                if(datum in data){
                    data[datum]++;
                }
                else{
                    data[datum] = 1;
                }
            });
            var x = [];
            var y = [];
            Object.keys(data).forEach(key =>{
                x.push(key);
                y.push(data[key]);
            });

            interesting.chart = makeChart("bar", x, header1, y, "#");


            var maxKey = Object.keys(data).reduce(function(a, b){ return data[a] > data[b] ? a : b });
            var total = Object.values(data).reduce((a, b) => a + b, 0);
            var percent = Math.round(((data[maxKey]/total)*100 * 1000) / 1000);
            interesting.features.push("\""+maxKey+"\" was the most frequently occurring string, appearing "+data[maxKey]+" times ("+percent+"%)");

            return interesting;

        }
        else{
            return null; //Its not interesting    
        }
    }


    //If a user has marked it as a likely dependant variable, then its automatically interesting for that reason
    Story.instance.metadata.dependencies.forEach(dependency => {
        if((dependency["dependent"] == header1 && dependency["independent"] == header2) || (dependency["dependent"] == header2 && dependency["independent"] == header1)){
            interesting.features.push("You suggested there may be a relationship between these variables");
            //break;
            //TODO: js doesn't allow "break" in a .forEach() loop; using .some() loop might be better,
            //but not really more readable, and this loops is short enough that it likely doesn't matter
        }
    });


    //At least one column contains datetime data
    if(col1[0] instanceof Date || col2[0] instanceof Date){
        if (col1[0] instanceof Date && col2[0] instanceof Date){
            //If they're both dates, they could/should be a scatter plot
            //Create a (hypothetically) interesting chart - we'll add reasons why it might be interesting later
            interesting.chart = makeChart("scatter", col1, header1, col2, header2);

            //Test for correlation
            var corrNarrative = getCorrelation(col1, col2);
            if(corrNarrative) {
                interesting.features.push(corrNarrative);
            }

            //Test for clusters
            var clusters = getClusters(col1, col2);
            if(Math.max(...clusters) > 1){
                interesting.features.push("There are approximately "+Math.max(...clusters)+" distinct clusters in this data");
            }
            console.log(clusters);

            //Test for numerical outliers
            var xOutliers = getIQROutliers(col1);
            var yOutliers = getIQROutliers(col2);
            console.log(header1, xOutliers);
            console.log(header2, yOutliers);
            var numOutliers = xOutliers.length + yOutliers.length;
            if(numOutliers > 0) {
                interesting.features.push("There are approximately "+numOutliers+" outliers in this data");
            }

            //If there are no reasons that this chart would be interesting, return null 
            if(interesting.features.length == 0 || interesting.chart == null){
                return null;
            }
            else{
                return interesting;   
            }
        }
        else if(col1[0] instanceof Date && !isNaN(col2[0])){
            x = col1.map(date => date.getTime());
            xheader = header1;
            y = col2;
            yheader = header2;
        }
        else if(col2[0] instanceof Date && !isNaN(col1[0])){
            x = col2.map(date => date.getTime())
            xheader = header2;
            y = col1;
            yheader = header1;
            //Swap these around so that chart labels look
            //nicer; e.g. "Value/year"
            interesting.header1 = header2;
            interesting.header2 = header1;
        }
        else{
            //TODO: One column is category data: what do?
            return;
        }


        //Create a (hypothetically) interesting chart - we'll add reasons why it might be interesting later
        interesting.chart = makeChart("line", x, xheader, y, yheader);


        var corrNarrative = getCorrelation(x, y);
        if(corrNarrative) {
            interesting.features.push(corrNarrative);
        }

        //Test for clusters
        var clusters = getClusters(x, y);
        if(Math.max(...clusters) > 1){
            interesting.features.push("There are approximately "+Math.max(...clusters)+" distinct clusters in this data");
        }

        //Test for numerical outliers
        var xOutliers = getIQROutliers(x);
        var yOutliers = getIQROutliers(y);
        var numOutliers = xOutliers.length + yOutliers.length;
        if(numOutliers > 0) {
            interesting.features.push("There are approximately "+numOutliers+" outliers in this data");
        }

        //TODO: test for peaks/troughs

    }
    //Both columns are numeric data
    else if(!(col1[0] instanceof Date) && !isNaN(col1[0]) && !(col2[0] instanceof Date) && !isNaN(col2[0])){
        
        //Create a (hypothetically) interesting chart - we'll add reasons why it might be interesting later
        interesting.chart = makeChart("scatter", col1, header1, col2, header2);

        //Test for correlation
        var corrNarrative = getCorrelation(col1, col2);
        if(corrNarrative) {
            interesting.features.push(corrNarrative);
        }

        //Test for clusters
        var clusters = getClusters(col1, col2);
        if(Math.max(...clusters) > 1){
            interesting.features.push("There are approximately "+Math.max(...clusters)+" distinct clusters in this data");
        }
        console.log(clusters);

        //Test for numerical outliers
        var xOutliers = getIQROutliers(col1);
        var yOutliers = getIQROutliers(col2);
        console.log(header1, xOutliers);
        console.log(header2, yOutliers);
        var numOutliers = xOutliers.length + yOutliers.length;
        if(numOutliers > 0) {
            interesting.features.push("There are approximately "+numOutliers+" outliers in this data");
        }
    }
    else{
        //TODO: Other "interesting"ness checks
    }

   //If there are no reasons that this chart would be interesting, return null 
   if(interesting.features.length == 0 || interesting.chart == null){
        return null;
    }
    else{
        return interesting;   
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
    var dbscanner = jDBSCAN().eps(5000).minPts(1).distance('EUCLIDEAN').data(pointData);
    return dbscanner();
}


function getCorrelation(column1, column2){
    var corr = getPearsonCorrelation(column1, column2);
    var roundedCorr = Math.round(corr * 1000) / 1000;

    var corrNarrative = null;
    if(Math.abs(corr) > 0.9){
        corrNarrative = "There is a very strong correlation between these features (r="+roundedCorr+")";
    }
    else if(Math.abs(corr) > 0.8){
        corrNarrative = "There is a strong correlation between these features (r="+roundedCorr+")";
    }
    else if(Math.abs(corr) > 0.7){
        corrNarrative = "There is a fairly strong correlation between these features (r="+roundedCorr+")";
    }
    else if(Math.abs(corr) > 0.6){
        corrNarrative = "There is a fairly weak correlation between these features (r="+roundedCorr+")";
    }
    else if(Math.abs(corr) > 0.5){
        corrNarrative = "There is a weak correlation between these features (r="+roundedCorr+")";
    }

    return corrNarrative;
}


function makeChart(chartType, x, xLabel, y, yLabel){

    var chart = new Chart();
    chart.setType(chartType);

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
    chart.setXLabel(xLabel);
    chart.setY(y);
    chart.setYLabel(yLabel);
    chart.setTitle(
    yLabel.charAt(0).toUpperCase() +
      yLabel.slice(1) +
      " vs " +
      xLabel
    );

    return chart;
}