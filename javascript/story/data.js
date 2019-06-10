
class Data {
  constructor(rawData=null, headersOfInterest=[]) {
    this.rawData = rawData;
    this.headers = [];
    this.headersOfInterest = headersOfInterest;
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