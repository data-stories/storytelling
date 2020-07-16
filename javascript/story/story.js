/**
 * A data story class containing different story blocks.
 */
class Story {


  /**
   * Constructs a Story object with initialising all the class properties.
   */
  constructor() {
    /** All the StoryBlocks. 
     * @private
     * @type {Array}
    */
    this.blocks = [];
    /**
     * Data used in the Story object.
     * @private
     * @type {Data}
     */
    this.data = null;
    /**
     * Metadata of the Story object.
     * @private
     * @type {Metadata}
     */
    this.metadata = new Metadata();
  }

  /**
   * Sets the data property of the object.
   * @param {Data} newData 
   */
  setData(newData){
    this.data = newData;
  }

  /**
   * Sets the metaData property of the object.
   * @param {Metadata} newMetadata 
   */
  setMetadata(newMetadata){
    this.metaData = newMetadata;
  }

  /**
   * Appends a new story block in the blocks property.
   * @param {StoryBlock} block 
   */
  appendBlock(newBlock){
    this.blocks.push(newBlock);
  }


  /**
   * Create a new Story object from a data (.csv) file
   * @param {*} file 
   * @param {*} callback 
   */
  static createFromDataFile(file, callback){
    var reader = new FileReader();
    reader.addEventListener("load", function(){

      var data = d3.csvParse(reader.result, function(d){
        return d;   
      });

      Story.instance = new Story();
      Story.instance.setData(new Data(data));
      callback();
    });

    if (file) {
      reader.readAsText(file);
    }
  }


  /**
   * Create a new Story object from a previously saved .story (.json) file
   * @param {*} file 
   * @param {*} callback 
   */
  static createFromStoryFile(file, callback){
    var reader = new FileReader();
    reader.addEventListener("load", function(){

      var storyData = JSON.parse(reader.result);

      Data.instance = new Data(storyData["data"]["rawData"], storyData["data"]["parsedData"]);

      Story.instance = new Story();
      Story.instance.setData(Data.instance);
      Story.instance.data.headersOfInterest = storyData["data"]["headersOfInterest"];
      Story.instance.data.dependencies = storyData["data"]["dependencies"];

      Story.instance.metadata.title = storyData["title"];
      Story.instance.metadata.author = storyData["author"];

      storyData["blocks"].forEach(function(block){
        Story.instance.blocks.push(StoryBlock.createFromJSON(block));
      });

      callback();
    });

    if (file) {
      reader.readAsText(file);
    }
  }
}

/**
 * A base class describing individual story blocks.
 */
class StoryBlock {

  /**
   * Initialises the properties of the base class.
   */
  constructor(content) {
    //Explicitly force this class to be Abstract
    if (new.target === StoryBlock) {
      throw new TypeError("Cannot construct StoryBlock instances directly");
    }
    this.content = content;
  }

  /**
   * 
   */
  renderToAuthor() {
    throw new Error("Each subclass should implement a renderToAuthor() method")
  }

  renderToHTML() {
    throw new Error("Each subclass should implement a renderToHTML() method")
  }

  // Not needed if using JSON.stringify
  // renderToJSON() {
  //   throw new Error("Each subclass should implement a renderToJSON() method")
  // }

  // Not needed as same structure as renderToHTML
  // renderToSlides() {
  //   throw new Error("Each subclass should implement a renderToSlides() method")
  // }

  // TODO: Add comments to explain this static method. This method cannot be
  // implemented before the implementation of exporting story to json.
  /**
   * 
   * @param {*} json 
   */
  static createFromJSON(json){
    //TODO: IMPLEMENT THIS.
    console.error("StoryBlock.createFromJSON is not yet implemented!");
    return new TextBlock("StoryBlock.createFromJSON is not yet implemented!", "error");
  }
}

/**
 * A story block containing textual information.
 */
class TextBlock extends StoryBlock {

  /**
   * Initialises the properties of the super class and the child class.
   */
  constructor(content, cfoType) {
    super(content);
    this.cfoType = cfoType;   // CFO Pattern subtype
  }


  /**
   * Renders the block to the author, for editing, and pre-fills any existing content
   */
  renderToAuthor() {
    var content = (this.content) ? this.content : "";

    var block = $('<div>');
    block.addClass('text-block');
    var select = $('<select>');
    select.addClass('custom-select');
    select.addClass('block-type');
    var option = $('<option value="">(None)</option>');
    select.append(option);
    for(var cfotype in CFOTYPES) {
      var selected = (this.cfoType === cfotype) ? "selected" : "";
      var option = $('<option value="'+cfotype+'" '+selected+'>'+cfotype+'</option>');
      select.append(option);
    }
    block.append(select);
    var textarea = $('<textarea class="form-control" rows="4" cols="100">'+content+'</textarea>');
    block.append(textarea);

    return block;
  }

  /**
   * Renders the block as HTML
   */
  renderToHTML() {
    return '<p>'+this.content+'</p>'
  }

}

/**
 * A story block containing a data visualisation.
 */
class ChartBlock extends StoryBlock {
  /**
   * Initialises the properties of the super class and the child class.
   */
  constructor(content) {
    super(content);
  }

  /**
   * Renders the block to the author, for editing, and pre-fills any existing content
   */
  renderToAuthor() {
    if(this.content){
      return this.renderToHTML();
    }
    var chartButtons = $('<div>');
    var charts = getRecommendedCharts();

    var buttons_to_display;
    if(charts.length >= 3){
      buttons_to_display = 3;
    }
    else if(charts.length > 0) {
      buttons_to_display = charts.length;
    }
    else{
      //TODO: Return a way of manually creating charts!!
      chartButtons.append($('<p>No recommended charts!</p>'))
      return chartButtons;
    }

    var row = $('<div>');
    row.addClass('row');
    for(let i = 0; i<buttons_to_display; i++){
      var col = $('<div>');
      col.addClass('col-4');
      var chartPreview = $('<div>');
      chartPreview.addClass('chart-preview');
      col.append(chartPreview);
      charts[i].render(d3.select(chartPreview[0]), 325, 140);
      var button = $('<button class="btn btn-primary btn-chart">'+charts[i].title+'</button>');
      button.click(function(){
        var container = $(this).parent().parent().parent();
        container.empty();
        container.addClass("chart-block");
        charts[i].render(d3.select(container[0]));
        addEditChartButton(container.parent());
      });
      col.append(button);
      row.append(col);
    }

    chartButtons.append(row);

    if(charts.length > 3){

      chartButtons.append($('</br>'));
      var button = $('<button class="btn btn-secondary btn-chart">Show more</button>');
      button.click(function(){
        $(this).siblings(".row").each(function(){
          $(this).show();
        });
        $(this).remove();
      });
      chartButtons.append(button);

      for(let i = 3; i<charts.length; i+=3){

        var row = $('<div>');
        row.addClass('row');
        row.hide();

        for(let j = 0; j<3; j++){
          if(!charts[i+j]){
            break;
          }
          var col = $('<div>');
          col.addClass('col-4');
          var chartPreview = $('<div>');
          chartPreview.addClass('chart-preview');
          col.append(chartPreview);
          charts[i+j].render(d3.select(chartPreview[0]), 325, 140);

          var button = $('<button class="btn btn-primary btn-chart">'+charts[i+j].title+'</button>');
          button.click(function(){
            var container = $(this).parent().parent().parent();
            container.empty();
            container.addClass("chart-block");
            charts[i+j].render(d3.select(container[0]));
            addEditChartButton(container.parent());
          });
          col.append(button);
          row.append(col);
        }
        chartButtons.append(row);

      }
    }

    // Create a custom chart creation panel
    chartButtons.append($('</br>'));

    var card = $('<div class="card w-50 m-3">');
    card.append('<h6 class="card-header">Custom Chart</h6>');

    var cardBody = $('<div class="card-body">');

    var selectChartType = $('<select class="custom-select col-sm-4 m-1" id="custom-chart-type">');
    selectChartType.append($('<option value="bar">Bar chart</option>'));
    selectChartType.append($('<option value="line">Line chart</option>'));
    selectChartType.append($('<option value="scatter">Scatter chart</option>'));

    var selectXCol = $('<select class="custom-select col-sm-4 m-1" id="custom-x-select">');
    for(let xa = 0; xa < Story.instance.data.headers.length; xa++) {
      var xAxisOption = $('<option value="' + Story.instance.data.headers[xa] + '">' + Story.instance.data.headers[xa] + '</option>');
      selectXCol.append(xAxisOption);
    }
    var selectYCol = $('<select class="custom-select col-sm-4 m-1" id="custom-y-select">');
    for(let xa = 0; xa < Story.instance.data.headers.length; xa++) {
      var yAxisOption = $('<option value="' + Story.instance.data.headers[xa] + '">' + Story.instance.data.headers[xa] + '</option>');
      selectYCol.append(yAxisOption);
    }

    var button = $('<button class="btn btn-primary btn-chart m-1 pull-right"> Create</button>');
    button.click(function(){
      var chartType = $('#custom-chart-type').val();
      var header1 = $('#custom-x-select').val();
      var header2 = $('#custom-y-select').val();
      var col1 = Story.instance.data.getColumn(header1);
      var col2 = Story.instance.data.getColumn(header2);
      var chart = makeChart(chartType, col1, header1, col2, header2);
      var container = $(this).parent().parent().parent().parent();

      // Insert the chart directly inline
      container.empty();
      container.addClass("chart-block");
      chart.render(d3.select(container[0]));
      addEditChartButton(container.parent());
    });

    var formGroup = $('<div class="form-group row">');

    cardBody
      .append($('<label for="custom-chart-type" class="col-sm-4 col-form-label">Chart Type</label>'))
      .append(selectChartType)
      .append($('</br>'))
      .append($('<label for="custom-x-select" class="col-sm-4 col-form-label">Independent</label>'))
      .append(selectXCol)
      .append($('</br>'))
      .append($('<label for="custom-y-select" class="col-sm-4 col-form-label">Dependent</label>'))
      .append(selectYCol)
      .append($('</br>'))
      .append(button);

    formGroup.append(cardBody);
    card.append(formGroup);
    chartButtons.append(card);

    return chartButtons;
  }

  /**
   * Renders the block as HTML
   */
  renderToHTML() {
    return '<div class="chart-block">'+this.content+'</div>';
  }
}

/**
 * A story block containing a (captioned) image. 
 */
class ImageBlock extends StoryBlock {
  /**
   * Initialises the properties of the super class and the child class.
   */
  constructor(content, url) {
    super(content);
    this.url = url;
  }

  /**
   * Renders the block to the author, for editing, and pre-fills any existing content
   */
  renderToAuthor() {
    var content = (this.content) ? this.content : "";
    var url = (this.url) ? this.url : "";
    var buttonText = (this.url) ? "Update" : "Preview";
    
    var form_group, inner_div, input;
    var block = $('<div class="image-block">');
    var form = $('<form>');
    block.append(form);

    form_group = $('<div class="form-group row">');
    form.append(form_group);
    form_group.append('<label class="col-sm-2 col-form-label">URL:</label>');
    inner_div = $('<div class="col-sm-6">');
    form_group.append(inner_div);
    input = $('<input class="form-control image-url">');
    input.val(url);
    inner_div.append(input);

    form_group = $('<div class="form-group row">');
    form.append(form_group);
    form_group.append('<label class="col-sm-2 col-form-label">Caption:</label>');
    inner_div = $('<div class="col-sm-6">');
    form_group.append(inner_div);
    input = $('<input class="form-control image-caption">');
    input.val(content);
    inner_div.append(input);

    form_group = $('<div class="form-group row">');
    form.append(form_group);
    inner_div = $('<div class="col-sm-10">');
    form_group.append(inner_div)
    var button = $('<button class="btn btn-primary">'+buttonText+'</button>')
      .click(function(){
        var form = $(this).parent().parent().parent();
        console.log(form);
        var url = form.find('.image-url').val();
        var caption = form.find('.image-caption').val();
        var figure = form.find('figure');
        figure.find('img').attr('src', url);
        figure.find('img').attr('alt', caption);
        figure.find('figcaption').text(caption);
        figure.show();
      });
    inner_div.append(button);

    var figure;
    if(this.url){
      figure = $('<figure class="text-center">');
      figure.append('<img width="90%" src="'+this.url+'" alt="'+this.content+'">');
      figure.append('<figcaption>'+this.content+'</figcaption>');
    }
    else{
      figure = $('<figure class="text-center" style="display:none">');
      figure.append('<img width="90%">');
      figure.append('<figcaption>');
    }
    form.append(figure);

    return block;
  }

  /**
   * Renders the block as HTML
   */
  renderToHTML() {
    var content = (this.content) ? this.content : "";
    var url = (this.url) ? this.url : "";
    
    var figure = $('<figure>');
    figure.append('<img src="'+this.url+'" alt="'+this.content+'">');
    figure.append('<figcaption>'+this.content+'</figcaption>');

    return figure.html();
  }
}

/**
 * A story block containing a data table. 
 */
class DataBlock extends StoryBlock {
  /**
   * Initialises the properties of the super class and the child class.
   */
  constructor(content) {
    super(content);
  }

  /**
   * Renders the block to the author, for editing, and pre-fills any existing content
   */
  renderToAuthor() {
    var block = '<div class="data-block">&lt;Display recommended data snippets here&gt;</div>';
    return block;
  }

  /**
   * Renders the block as HTML
   */
  renderToHTML() {
    return "<div>"+this.content+"</div>";
  }
}