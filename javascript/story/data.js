class Data {
  constructor(rawData) {
    this.rawData = rawData;
    this.headers = Object.keys(rawData[0]);
    this.headersOfInterest = [];
    this.dependencies = [];
  }


  detectTrends(){
      throw new Error("Not Implemented")
  }

  detectSpikes(){
      throw new Error("Not Implemented")
  }

  recommendCharts(){
      throw new Error("Not Implemented")
  }

  recommendStructure(){
      throw new Error("Not Implemented")
  }
}