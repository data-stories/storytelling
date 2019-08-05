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
                labels[i] = "";
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