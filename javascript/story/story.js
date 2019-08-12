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

      Data.instance = new Data(storyData["data"]["rawData"]);

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
  constructor(content) {
    super(content);
  }


  /**
   * Renders the block to the author, for editing, and pre-fills any existing content
   */
  renderToAuthor() {
    var content = (this.content) ? this.content : "";
    return '<textarea class="text-block" rows="4" cols="100">'+content+'</textarea>';
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
    var block = $('<div>');
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
      block.append($('<p>No recommended charts!</p>'))
      return block;
    }

    for(let i = 0; i<buttons_to_display; i++){
      var button = $('<button class="btn btn-primary btn-chart">'+charts[i].title+'</button>');
      button.click(function(){
        var container = $(this).parent();
        container.empty();
        container.addClass("chart-block");
        charts[i].render(d3.select(container[0]));
      });
      block.append(button);
    }

    if(charts.length <= 3){
      return block;
    }

    var button = $('<button class="btn btn-secondary btn-chart">Show more</button>');
    button.click(function(){
      $(this).siblings(".btn-chart").each(function(){
        console.log($(this));
        $(this).show();
      });
      $(this).remove();
    });
    block.append(button);

    for(let i = 3; i<charts.length; i++){
      var button = $('<button class="btn btn-primary btn-chart" style="display: none">'+charts[i].title+'</button>');
      button.click(function(){
        var container = $(this).parent();
        container.empty();
        container.addClass("chart-block");
        charts[i].render(d3.select(container[0]));
      });
      block.append(button);
    }

    return block;
  }

  /**
   * Renders the block as HTML
   */
  renderToHTML() {
    return '<div class="chart-block">'+this.content+'</div>';
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