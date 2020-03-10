/**
 * The rule-based recommendation system.
 */

/**
 * Here we use an extended version of the CFO Pattern proposed by https://dl.acm.org/doi/10.2312/eurovisshort.20171129
 * We add 'Introduction' and 'Article Conclusion' to round-off the types necessary for a whole article.
 * A typical string representation for a story might be ICFFXOCFFFOCFFOZ.
 */
const CFOTYPES = {
  "Introduction": "I",          // One of these at the start of the article
  "Claim/question": "C",        // 1+ of these throughout the article
  "Fact/evidence": "F",         // 1+ of these for each claim
  "Explanation": "X",           // Optional for each fact/evidence
  "Conclusion": "O",            // Ties a number of fact/evidences back to a claim/question
  "Article conclusion": "Z"     // Summarises the article's contribution
};

const MAX_CLAIMS = 3;           // The maximum suggested number of claims in a story

/**
 * Provide a list of potential recommendations, dependent on the context of where in the story recommendations
 * are requested, based on a set of rules defined here.
 * @returns {Array} recs - array of StoryBlocks as recommendations
 */
function getRuleBasedRecommendations() {
  var recs = [];

  // Obtain the current story sections for the following two cases:
  //  - Up until the location where the recommendations are requested
  //  - Following the point where the recommendations are requested
  var prevSectionsArr = getCurrentStory(true, false);
  var nextSectionsArr = getCurrentStory(false, true);
  var allSectionsArr = [...prevSectionsArr, ...nextSectionsArr];

  // Generate string representations of the StoryBlock types for
  // each array for easier rule-based processing
  var pStr = getCFOTypeStrings(prevSectionsArr);
  var nStr = getCFOTypeStrings(nextSectionsArr);
  var aStr = getCFOTypeStrings(allSectionsArr);

  //console.log("[" + pStr + "]", "[" + nStr + "]");
  var recSet = [];

  /*
   * Narrative rules are defined below, in priority order
   */

  // RULE: story must start with an introduction
  if((pStr === "") && !/^I/.test(nStr)) {
    recs.push([new TextBlock("Introduce your article in a single paragraph, highlighting key questions and findings.", "Introduction")]);
  }

  // RULE: story must end with an article conclusion if we've reached a set amount of claims
  if(!/Z$/.test(pStr) && (nStr === "") && (pStr.split('C').length-1 >= MAX_CLAIMS)) {
    recs.push([new TextBlock("Provide a lead-out summary of the main conclusions in the article.", "Article conclusion")]);
  }

  // RULE: if preceded by an introduction or a Conclusion, and we have at least one narrative feature suggestion,
  // suggest the next one as a set of Claim, Fact, Explanation and Conclusion set
  if(Story.instance.metadata.features.length >= 1 && /[IO]$/.test(pStr)) {
    var narrFeature = Story.instance.metadata.features.shift();
    recSet = [];
    recSet.push(new TextBlock("State a claim regarding the chart below.", "Claim/question"));
    recSet.push(new ChartBlock(narrFeature.chart.render()._groups[0][0].innerHTML));
    recSet.push(new TextBlock("Introduce the concept of '"+narrFeature.header1+"' here; talk about what it is, why it matters, and so on.", "Explanation"));
    recSet.push(new TextBlock("Introduce the concept of '"+narrFeature.header2+"' here; talk about what it is, why it matters, and so on.", "Explanation"));
    for (var f = 0; f < narrFeature.intFeatures.length; f++) {
      var feature = narrFeature.intFeatures[f];
      recSet.push(new TextBlock("Potentially explain the observation that: " + feature + ".", "Fact/evidence"));
    }
    recSet.push(new TextBlock("Draw a conclusion, taking into account the claim, chart, and associated facts.", "Conclusion"));
    recs.push(recSet);
  }

  // RULE: if preceded by an Introduction or a Conclusion, and we have no narrative feature suggestions,
  // suggest a basic Claim/Fact/Conclusion set
  if(/[IO]$/.test(pStr)) {
    recSet = [];
    recSet.push(new TextBlock("State a claim about data already presented, or a new claim.", "Claim/question"));
    recSet.push(new TextBlock("Explain a fact to justify the claim.", "Fact/evidence"));
    recSet.push(new TextBlock("Draw a conclusion, taking into account the claim and associated facts.", "Conclusion"));
    recs.push(recSet);
  }

  // RULE: if preceded by a Claim, Fact/evidence, or Explanation, suggest another Fact/evidence
  if(/[CFX]$/.test(pStr)) {
    recs.push([new TextBlock("Use a fact to justify the claim.", "Fact/evidence")]);
  }

  // RULE: if preceded by a Fact/evidence, suggest an Explanation for that Fact/evidence
  if(/F$/.test(pStr)) {
    recs.push([new TextBlock("Elaborate on the fact/evidence just presented, e.g. the collection or analytical mechanisms.", "Explanation")]);
  }

  /*
   * End of rule definitions
   */

  return recs;
}


/**
 * Cycle through each section in an array of StoryBlock sections, returning a string of CFOTYPES character
 * representations for each section type for easier rule-based recommendation analysis.
 * @param {Array} sectionsArr - array of StoryBlock sections
 * @return {string} sectionsTypeStr - CFOTYPES string representation of each StoryBlock section
 */
function getCFOTypeStrings(sectionsArr) {
  var sectionsTypeStr = "";

  for(var i = 0; i < sectionsArr.length; i++) {
    var section = sectionsArr[i];
    if(section instanceof TextBlock) {
      // Obtain CFO Pattern type of TextBlock
      sectionsTypeStr += CFOTYPES[section.cfoType];
    } else if((section instanceof ImageBlock) || (section instanceof ChartBlock) || (section instanceof DataBlock)){
      // Chart, image, and data StoryBlock types are counted as 'Fact/evidence'
      sectionsTypeStr += "F";
    }
  }

  return sectionsTypeStr;
}