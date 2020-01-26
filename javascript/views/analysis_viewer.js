var interestingCharts = {};

function analysisViewInit(){

    if(Object.keys(interestingCharts).length > 0){
        return;
    }

    //Collect interesting features of data-column pairs
    //TODO: collect features of stand-alone data-columns?
    var headerPairs = getPairs(Story.instance.data.headers);
    headerPairs.forEach(function(pair){
        interestingFeatures = getInterestingFeatures(pair[0], pair[1]);
        if(interestingFeatures){
            interestingCharts[interestingFeatures.header1.replace(/ /g, "-")+"-"+interestingFeatures.header2.replace(/ /g, "-")] = interestingFeatures
        }
    });

    var row;
    var interesting = 0; //Used to alternate between adding rows/columns
    //Sort charts by how interesting they are
    Object.values(interestingCharts).sort((chart1, chart2) => chart2.features.length - chart1.features.length).forEach(interestingFeatures =>{
        interesting++;

        if(interesting % 2 == 1){
            row = $("<div>").attr("class", "row");
            $("#data-analysis").append(row);
        }

        var interestingDiv = $("<div>")
            .attr("id", interestingFeatures.header1.replace(/ /g, "-")+"-"+interestingFeatures.header2.replace(/ /g, "-"))
            .attr("class", "col-6 text-center");

        row.append(interestingDiv);

        interestingFeatures.chart.render(d3.select("#"+interestingDiv.attr("id")), 300, 175);
        interestingFeatures.features.forEach(t => {interestingDiv.append($("<p>").text(t))});

        var button = $("<button>")
            .attr("type", "button")
            .attr("class", "btn btn-primary interesting-data")
            .attr("interest", interestingFeatures.header1.replace(/ /g, "-")+"-"+interestingFeatures.header2.replace(/ /g, "-"))
            .attr("data-toggle", "button")
            .attr("aria-pressed", "false")
            .attr("autocomplete", "off")
            .text("Include")
            // .click(() => {
            //    
            // })

        interestingDiv.append(button);
        
    });

    if (interesting == 0) {
        $("#data-analysis").append($("<p>No features could be detected at this time</p>"));
    }
}

onPageEnter["analysis"] = analysisViewInit;

function analysisViewLeave(){
    $(".interesting-data.active").each(function(index, element){
        var interest = interestingCharts[$(element).attr("interest")];
        storyTemplate.push(new TextBlock("Introduce the concept of '"+interest["header1"]+"' here; talk about what it is, why it matters, and so on."));
        storyTemplate.push(new TextBlock("Introduce the concept of '"+interest["header2"]+"' here; talk about what it is, why it matters, and so on."));
        storyTemplate.push(new ChartBlock(interest.chart.render()._groups[0][0].innerHTML));
        storyTemplate.push(new TextBlock("Explain the relationship between the two variables, and reference the correlation or trend visualised above."));
    });
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
        //TODO: Check proportions/distributions

        return null;
    }


    //If a user has marked it as a likely dependant variable, then its automatically interesting for that reason
    Story.instance.metadata.dependencies.forEach(dependency => {
        if((dependency["dependent"] == header1 && dependency["independent"] == header2) || (dependency["dependent"] == header2 && dependency["independent"] == header1)){
            interesting.features.push("User suggested their may be a relationship between these variables");
            
            //break;
            //TODO: js doesn't allow "break" in a .forEach() loop; using .some() loop might be better,
            //but not really more readable, and this loops is short enough that it likely doesn't matter
        }
    });



    //At least one column contains datetime data
    if(col1[0] instanceof Date || col2[0] instanceof Date){

        if (col1[0] instanceof Date && col2[0] instanceof Date){
            //We probably don't care if they're both dates?
            //TODO: Maybe we do?
            return;
        }
        else if(col1[0] instanceof Date && !isNaN(col2[0])){
            x = col1.map(date => date.getTime())
            xheader = header1
            y = col2
            yheader = header2
        }
        else if(col2[0] instanceof Date && !isNaN(col1[0])){
            x = col2.map(date => date.getTime())
            xheader = header2
            y = col1   
            yheader = header1
        }
        else{
            //TODO: add additional checks here
            return;
        }

        //Create a (hypothetically) interesting chart - we'll add reasons why it might be interesting later
        interesting.chart = makeChart("line", x, xheader, y, yheader);

        //TODO: test for trends
        var corr = getPearsonCorrelation(x, y);

        interesting.features.push("There is a correlation of "+Math.round(corr * 1000) / 1000);
        

        //TODO: test for outliers/peaks/troughs

    }

    //Both columns are numeric data
    else if(!(col1[0] instanceof Date) && !isNaN(col1[0]) && !(col2[0] instanceof Date) && !isNaN(col2[0])){
        
        //Create a (hypothetically) interesting chart - we'll add reasons why it might be interesting later
        interesting.chart = makeChart("scatter", col1, header1, col2, header2);

        //Test for correlation
        var corr = getPearsonCorrelation(col1, col2);
        if(corr > 0.7){
            interesting.features.push("There is a correlation of "+Math.round(corr * 1000) / 1000);    
        }

        //Test for clusters
        var clusters = getClusters(col1, col2);
        if(Math.max(...clusters) > 1){
            interesting.features.push("There are approximately "+Math.max(...clusters)+" distinct clusters in this data");
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
        return interesting    
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