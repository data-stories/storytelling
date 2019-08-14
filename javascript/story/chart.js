/**
 * a chart class containing an individual chart.
 */
class Chart{

    /**
     * Construct an empty Chart object without initialising any class properties.
     */
    constructor(){
        
    }

    /**
     *  Sets the type of the Chart.
     * "bar": bar chart.
     * "line": line chart.
     * @param {string} newType 
     */
    setType(newType){

        this.type = newType;
        return this;
    }

    /**
     * Sets the x-axis.
     * @param {Array} x 
     */
    setX(x){

        this.x = x;
        return this;
    }

    /**
     * Sets the y-axis.
     * @param {Array} y 
     */
    setY(y){

        this.y = y;
        return this;
    }

    /**
     * Sets the label of the x-axis.
     * @param {string} label 
     */
    setXLabel(label){

        this.xLabel = label;
        return this;
    }

    /**
     * Sets the label of the y-axis.
     * @param {string} label 
     */
    setYLabel(label){
        this.yLabel = label;
        return this;
    }

    /**
     * Sets the title of the chart.
     * @param {string} title 
     */
    setTitle(title){
        this.title = title;
        return this;
    }

    /**
     * Sets the width of the chart.
     * @param {number} width 
     */
    setWidth(width){
        this.width = width;
        return this;
    }

    /**
     * Sets the height of the chart.
     * @param {number} height 
     */
    setHeight(height){
        this.height = height;
        return this;
    }

    /**
     * Uses D3 to render the chart within a container.
     * @param {Object} container 
     */
    render(container, width, height){

        this.margin = {top: 20, right: 20, bottom: 30, left : 40};
        this.svg_width = width || 960;
        this.svg_height = height || 500;
        this.width = this.svg_width - this.margin.left - this.margin.right;
        this.height = this.svg_height - this.margin.top - this.margin.bottom;

        this.genData();
        if (this.type === "bar"){
            this.renderBar(container);
        }
        else if (this.type === "line"){
            this.renderLine(container);
        }
        else if (this.type ==="scatter"){
            this.renderScatter(container);
        }
        else{
            console.error("Unrecognised chart type: " + this.type);
        }
    }

    /**
     * Transform the x and y values into the data object used by rendering functions.
     */
    genData(){
        this.data = [];
        for(var i = 0; i < this.x.length; i++){
            var vx = this.x[i];
            var vy = this.y[i];
            this.data.push({name:vx, value:vy});
        }
    }

    /**
     * Render the chart as a bar chart in the container.
     * @param {Object} container 
     */
    renderBar(container)
    {
        var x = d3.scaleBand()
                    .range([0,this.width])
                    .padding(0.1);
        var y = d3.scaleLinear()
                    .range([this.height, 0]);
        var height = this.height;
        var svg = container.append("svg")
                            .attr("width", this.svg_width)
                            .attr("height", this.svg_height)
                            .append("g")
                            .attr("transform",
                            "translate(" + this.margin.left + "," + this.margin.top + ")");
        x.domain(this.data.map(function(d){return d.name;}))
        y.domain([0, d3.max(this.data, function(d){return d.value;})]);

        svg.selectAll("rect")
            .data(this.data)
            .enter()
            .append("rect")
            .attr("x", function(d){
                return x(d.name);
            })
            .attr("y", function(d){
                return y(d.value);
            })
            .attr("width", x.bandwidth())
            .attr("height", function(d){
                return height - y(d.value);
            })
            .attr("fill", "teal");
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
        svg.append("g")
            .call(d3.axisLeft(y));
    }

    /**
     * Make the data set suitable for rendering line charts.
     * @param {Array} data 
     */
    lineData(newData)
    {
        var data = [];
        for (var i = 0; i < newData.length; i++){
            data.push({
                date: new Date(newData[i].name),
                value: parseFloat(newData[i].value)
            });
        }
        return data;
    }
    /**
     * Render the chart as a line chart in the container.
     * @param {Object} container 
     */
    renderLine(container)
    {
        var dataset = this.lineData(this.data);
        var xScale = d3.scaleTime()
                        .domain([
                            d3.min(dataset, function(d) {return d.date;}),
                            d3.max(dataset, function(d) {return d.date;})
                        ])
                        .range([0, this.width]);
        var yScale = d3.scaleLinear()
                        .domain([0, d3.max(dataset, function(d) {return d.value;})])
                        .range([this.height, 0]);

        var height = this.height;

        var line = d3.line()
                     .x(function(d){return xScale(d.date);})
                     .y(function(d){return yScale(d.value);});
        var svg = container.append("svg")
                        .attr("width", this.svg_width)
                        .attr("height", this.svg_height)
                        .append("g")
                        .attr("transform",
                                "translate(" + this.margin.left + "," + this.margin.top + ")");

        svg.append("path")
                .datum(dataset)
                .attr("fill", "none")
                .attr("stroke", "teal")
                .attr("stroke-width", "1.0")
                .attr("d", line);

        svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(xScale));

        svg.append("g")
                .call(d3.axisLeft(yScale));
    }

    /**
     * Render the chart as a scatter plot in the container.
     * @param {Object} container 
     */
    renderScatter(container)
    {
        var x = d3.scaleLinear()
                    .range([0,this.width]);
        var y = d3.scaleLinear()
                    .range([this.height, 0]);
        var height = this.height;
        var svg = container.append("svg")
                            .attr("width", this.svg_width)
                            .attr("height", this.svg_height)
                            .append("g")
                            .attr("transform",
                            "translate(" + this.margin.left + "," + this.margin.top + ")");
        x.domain([0, d3.max(this.data, function(d){return d.name;})]);
        y.domain([0, d3.max(this.data, function(d){return d.value;})]);

        svg.selectAll("dot")
            .data(this.data)
            .enter()
            .append("circle")
            .attr("cx", function(d){
                return x(d.name);
            })
            .attr("cy", function(d){
                return y(d.value);
            })
            .attr("r", 3.5)
            .attr("fill", "teal");
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
        svg.append("g")
            .call(d3.axisLeft(y));
    }
}