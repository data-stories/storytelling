function getRecommendedCharts(){

    var charts = [];

    // chart = new Chart();
    // chart.setX(Story.instance.metadata.interests);
    // values = [];
    // Story.instance.metadata.interests.forEach(function(interest){
    //     values.push(Story.instance.data.rawData[interest]);
    //     Story.instance.data.rawData.forEach(function(datum){
    //         datum[interest]
    //     });
    // });
    // chart.setY(values);
    // chart.setTitle("Averages")

    // charts.push(chart);


     Story.instance.metadata.interests.forEach(function(interest){


        var t = detectColumnType(interest);
        if(t == "Float" || t == "Integer"){
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
            chart.setTitle(interest);
            charts.push(chart);

        }
    });

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
        if (interests.includes(independentField) || interests.includes(dependentField)){
            var dependentFieldType = detectColumnType(dependentField);
            if (dependentFieldType == "Date" || dependentFieldType == "String"){
                // The dependent field is not a numeric field.
                continue;
            }
            var independentFieldType = detectColumnType(independentField);
            if (independentFieldType == "Date"){
                var chartType = "line";
            }
            else if (independentFieldType == "String"){
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
            chart.setX(x);
            chart.setY(y);
            charts.push(chart);
        }
    }
    return charts;
}

