class Story {

  constructor(data) {
    this.data = new Data(data);
    //this.blocks = [];

    //TODO: Adding a generic block, just for debugging purposes.
    this.blocks = [new TextBlock(0, "This is some story content", "introduction")];
  }

  static createFromDataFile(file, callback){
    var reader = new FileReader();
    reader.addEventListener("load", function(){

      var data = d3.csvParse(reader.result, function(d){
        return d;   
      });

      Story.instance = new Story(data);
      callback();
    });

    if (file) {
      reader.readAsText(file);
    }
  }


  static createFromStoryFile(file, callback){
    var reader = new FileReader();
    reader.addEventListener("load", function(){

      var storyData = JSON.parse(reader.result);

      Story.instance = new Story(storyData["data"]["rawData"]);
      Story.instance.data.headersOfInterest = storyData["data"]["headersOfInterest"];
      Story.instance.data.dependencies = storyData["data"]["dependencies"];

      Story.instance.title = storyData["title"];
      Story.instance.author = storyData["author"];

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

class StoryBlock {

  constructor(index, semantic_label) {
    if (new.target === StoryBlock) {
      throw new TypeError("Cannot construct StoryBlock instances directly");
    }
    this.index = index;
    this.semantic_label = semantic_label;
  }

  static createFromJSON(json){
    //TODO: IMPLEMENT THIS
    console.error("StoryBlock.createFromJSON is not yet implemented!");
    return new TextBlock(0, "StoryBlock.createFromJSON is not yet implemented!", "error");
  }
}

class TextBlock extends StoryBlock {
  constructor(index, content, semantic_label) {
    super(index, semantic_label);
    this.content = content;
  }
}

class ChartBlock extends StoryBlock {
  constructor(index, chart, semantic_label) {
    super(index, semantic_label);
    this.chart = chart;
  }
}

class DataBlock extends StoryBlock {
  constructor(index, dataSnippet, semantic_label) {
    super(index, semantic_label);
    this.dataSnippet = dataSnippet;
  }
}