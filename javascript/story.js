
class DataStory {
  constructor(data, headersOfInterest=[]) {
    this.data = data;
    this.headersOfInterest = headersOfInterest;
    this.blocks = [];
  }
}


class StoryBlock {

  constructor(index, semantic_label) {

    if (new.target === Block) {
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