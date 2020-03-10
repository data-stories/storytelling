// TODO: deprecated - remove when rule-based system in place
// Used by:
//  - analysis_viewer.js to populate with recommended story blocks
//  - story_viewer.js to 'pop' recommendations from when 'Recommendation' is clicked
var storyTemplate = [];


/**
 * Here we use an extended version of the CFO Pattern proposed by https://dl.acm.org/doi/10.2312/eurovisshort.20171129
 * We add 'Introduction' and 'Article Conclusion' to round-off the types necessary for a whole article
 */
var CFOTYPES = {
  "Introduction": "I",          // One of these at the start of the article
  "Claim/question": "C",        // 1+ of these throughout the article
  "Fact/evidence": "F",         // 1+ of these for each claim
  "Explanation": "X",           // Optional for each fact/evidence
  "Conclusion": "O",            // Ties a number of fact/evidences back to a claim/question
  "Article conclusion": "Z"     // Summarises the article's contribution
};


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

  // Rule: story must start with an introduction
  if((pStr === "") && (nStr.search(/^I/) === -1) ) {
    recs.push(new TextBlock("Introduce your article in a single paragraph, highlighting key questions and findings.", "Introduction"));
  }

  // Rule:

  // Rule: story must end with an article conclusion
  if((pStr.search(/Z$/) === -1) && (nStr === "")) {
    recs.push(new TextBlock("Provide a lead-out summary of the main conclusions in the article.", "Article conclusion"));
  }

  return recs;
}


/**
 * Cycle through each section in an array of StoryBlock sections, returning a string of CFOTYPES character
 * representations for each section type for easier rule-based recommendation analysis.
 * @param {Array} sectionsArr - array of StoryBlock sections
 * @return {Array} sectionsTypeStr - CFOTYPES string representation of each StoryBlock section
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