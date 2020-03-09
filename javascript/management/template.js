// TODO: deprecated - remove when rule-based system in place
// Used by:
//  - analysis_viewer.js to populate with recommended story blocks
//  - story_viewer.js to 'pop' recommendations from when 'Recommendation' is clicked
var storyTemplate = [];


/*
 * Here we use an extended version of the CFO Pattern proposed by https://dl.acm.org/doi/10.2312/eurovisshort.20171129
 * We add 'Introduction' and 'Article Conclusion' to round-off the types necessary for a whole article
 */
var CFOTYPES = {
  "Introduction": "I",          // One of these at the start of the article
  "Claim/question": "C",        // 1+ of these throughout the article
  "Fact/evidence": "F",         // 1+ of these for each claim
  "Explanation": "X",           // Optional for each fact/evidence
  "Conclusion": "C",            // Ties a number of fact/evidences back to a claim/question
  "Article conclusion": "Z"     // Summarises the article's contribution
};


function getRuleBasedRecommendations() {
  console.log("Getting story recs - start");

  var prevSectionsArr = getCurrentStory(true, false);
  var nextSectionsArr = getCurrentStory(false, true);
  var allSectionsArr = [...prevSectionsArr, ...nextSectionsArr];

  var prevSectionsTypeStr = getCFOTypeStrings(prevSectionsArr);
  var nextSectionsTypeStr = getCFOTypeStrings(nextSectionsArr);
  var allSectionsTypeStr = getCFOTypeStrings(allSectionsArr);

  // ** Rules go here **

  console.log("Getting story recs - complete");
}


/*
 * Cycle through each section in an array of sections, returning a CFOTYPES string
 * representation for each section type for easier rule-based recommendation analysis
 * NB: chart, image, and data blocks are counted as 'Fact/evidence'
 */
function getCFOTypeStrings(sectionsArr) {
  var sectionsTypeStr = "";

  for(var i = 0; i < sectionsArr.length; i++) {
    var section = sectionsArr[i];
    if(section instanceof TextBlock) {
      sectionsTypeStr += CFOTYPES[section.cfoType];
    } else if((section instanceof ImageBlock) || (section instanceof ChartBlock) || (section instanceof DataBlock)){
      sectionsTypeStr += "F";
    }
  }

  return sectionsTypeStr;
}