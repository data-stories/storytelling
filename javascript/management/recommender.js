function getRecommendedCharts(){

    var charts = [];

    charts = charts.concat(chartsInterestDependency());

    charts = charts.concat(chartsInterests());

    // Story.instance.metadata.dependencies.forEach(function(dependency){

    // });

    //TODO: Recommend charts

    //TODO: Recommend sensible charts

    //TODO: Recommend a mixture of bar/line charts

    //TODO: Weight recommended charts based on template

    //TODO: Weight recommended charts based on previously selected charts

    //TODO: Prevent recommender from recommending existing charts

    return charts;
}

/**
 * Recommends an array of charts based on authors expressed interests and potential dependencies.
 * The type of each recommended chart depends on the type of x-axis.
 */
function chartsInterestDependency(){
    var interests = Story.instance.metadata.interests;
    var dependencies = Story.instance.metadata.dependencies;

    var charts = [];
    for(var i=0; i< dependencies.length; i++){
        dependency = dependencies[i]
        var independentField = dependency.independent;
        var dependentField = dependency.dependent;
        if (Object.keys(interests).includes(independentField) || Object.keys(interests).includes(dependentField)){
            var dependentFieldType = interests[dependentField];
            if (dependentFieldType == "datetime" || dependentFieldType == "string"){
                // The dependent field is not a numeric field.
                continue;
            }
            var independentFieldType = interests[independentField];
            if (independentFieldType == "datetime"){
                var chartType = "line";
            }
            else if (independentFieldType == "string"){
                var chartType = "bar";
            }
            else{
                var chartType = "scatter";
            }
            var chart = new Chart();
            chart.setType(chartType);
            var x = [];
            var y = [];
            Story.instance.data.rawData.forEach(function(datum){
                x.push(datum[independentField]);
                y.push(datum[dependentField]);
            });
            // calculate the average value of each x
            if (chartType == "bar"){
                var x_unique = {};
                var x_unique_size = {};
                for(var i=0; i<x.length; i++){
                    if (x[i] in x_unique){
                        x_unique[x[i]] += y[i];
                        x_unique_size[x[i]] += 1;
                    } 
                    else{
                        x_unique[x[i]] = y[i];
                        x_unique_size[x[i]] = 1;
                    }
                }
                x = []
                y = []
                for (var i=0; i<x_unique.length; i++){
                   x.push(x_unique[i]); 
                   y.push(x_unique[i] / x_unique_size[i]);
                }

            }

            chart.setX(x);
            chart.setXLabel(independentField);
            chart.setY(y);
            chart.setYLabel(dependentField);
            chart.setTitle(dependentField.charAt(0).toUpperCase() + dependentField.slice(1)+" vs "+independentField)
            charts.push(chart);
        }
    }
    return charts;
}

function chartsInterests(){
    var charts = [];
    Object.keys(Story.instance.metadata.interests).forEach(function(interest){
        var t = Story.instance.metadata.interests[interest];
        if(t == "float" || t == "integer"){
            chart = new Chart();
            chart.setType("bar");
            values = [];
            Story.instance.data.rawData.forEach(function(datum){
                values.push(datum[interest]);
            });
            chart.setY(values);

            //chart.setX(Array(values.length));
            labels = [];
            for(let i=0; i<values.length; i++){
                labels[i] = i;
            }
            chart.setX(labels);
            chart.setXLabel(interest);
            chart.setTitle("Value of "+interest);
            charts.push(chart);

        }
    });
    return charts;
}

