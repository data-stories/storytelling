class Story {

  constructor(data) {
    this.data = new Data(data);
    this.blocks = []
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
}

class StoryBlock {

  constructor(index, semantic_label) {
    if (new.target === StoryBlock) {
      throw new TypeError("Cannot construct StoryBlock instances directly");
    }
    this.index = index;
    this.semantic_label = semantic_label;
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