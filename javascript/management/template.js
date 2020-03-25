/**
 * Here we use an extended version of the CFO Pattern proposed by https://dl.acm.org/doi/10.2312/eurovisshort.20171129
 * We add 'Introduction' and 'Article Conclusion' to round-off the types necessary for a whole article.
 * A typical string representation for a story might be ICFFXOCFFFOCFFOZ.
 */
const CFOTYPES = {
  "(None)": "U",                // Undefined
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
 * @param container - DOM story block context in the story recommendations are required
 * @returns {Array} recSetArr - array of StoryBlocks as recommendations
 */
function getRuleBasedRecommendations(container) {
  var recSetArr = [];

  // Obtain the current story sections for the following two cases:
  //  - Up until the location where the recommendations are requested
  //  - Following the point where the recommendations are requested
  var prevSectionsArr = getCurrentStory(true, false, container);
  var nextSectionsArr = getCurrentStory(false, true, container);

  // Generate string representations of the StoryBlock types for
  // each array for easier rule-based processing
  var pStr = getCFOTypeStrings(prevSectionsArr);
  var nStr = getCFOTypeStrings(nextSectionsArr);

  console.log("[" + pStr + "]", "[" + nStr + "]");

  /*
   * Narrative rules are defined below, in priority order
   */

  // RULE: story must start with an introduction
  if((pStr === "") && !/^I/.test(nStr)) {
    var recArr = [new TextBlock("Introduce your article and subject matter in a single paragraph, highlighting key questions and findings.", "Introduction")];
    recSetArr.push(createRecBlock("Add article introduction - <i>important to set context and an overview of findings</i>", recArr));
  }

  // RULE: story should end with an article conclusion if we've reached a set amount of claims
  if(!/Z$/.test(pStr) && (nStr === "") && (pStr.split('C').length-1 >= MAX_CLAIMS)) {
    var recArr = [new TextBlock("Provide a lead-out summary of the main conclusions in the article.", "Article conclusion")];
    recSetArr.push(createRecBlock("Add article conclusion - <i>you have made at least "+MAX_CLAIMS+" claims, you should now conclude your article to avoid overwhelming your readership</i>", recArr));
  }

  // RULE: if preceded by an introduction or a Conclusion, and we have at least one narrative feature suggestion,
  // suggest the next one as a set of Claim, Fact, Explanation and Conclusion set
  if(Story.instance.metadata.features.length >= 1 && /[IO]$/.test(pStr)) {
    // TODO: now we've delayed processing of the recommendations, the features need to be replenished somehow
    // maybe add an optional function callback to recSetArr to remove the 'feature' explicitly? (Likely need a closure)
    // or perhaps better: just iterate through all narrative features and add each of them as a separate set of recommendations
    // (do this nondestuctively to the metadata.features array)
    var narrFeature = Story.instance.metadata.features.shift();
    var recArr = [];
    recArr.push(new TextBlock("State a claim regarding the chart below.", "Claim/question"));
    recArr.push(new ChartBlock(narrFeature.chart.render()._groups[0][0].innerHTML));
    recArr.push(new TextBlock("Introduce the concept of '"+narrFeature.header1+"' here; talk about what it is, why it matters, and so on.", "Explanation"));
    recArr.push(new TextBlock("Introduce the concept of '"+narrFeature.header2+"' here; talk about what it is, why it matters, and so on.", "Explanation"));
    for (var f = 0; f < narrFeature.intFeatures.length; f++) {
      var feature = narrFeature.intFeatures[f];
      recArr.push(new TextBlock("Potentially explain the observation that: " + feature + ".", "Fact/evidence"));
    }
    recArr.push(new TextBlock("Draw a conclusion, taking into account the claim, chart, and associated facts.", "Conclusion"));
    // TODO: add both header column names to reason to distinguish them
    recSetArr.push(createRecBlock("Present new claim supported by observed data features - <i>present an argument in terms of claims, facts, and optional explanations to offer more detail on interpreting facts, helps to structure and clarify your arguments</i>", recArr));
  }

  // RULE: if preceded by an Introduction or a Conclusion, and we have no narrative feature suggestions,
  // suggest a basic Claim/Fact/Conclusion set
  if(/[IO]$/.test(pStr)) {
    var recArr = [];
    recArr.push(new TextBlock("State a claim about data already presented, or a new claim.", "Claim/question"));
    recArr.push(new TextBlock("Explain a fact to justify the claim.", "Fact/evidence"));
    recArr.push(new TextBlock("Draw a conclusion, taking into account the claim and associated facts.", "Conclusion"));
    recSetArr.push(createRecBlock("Present a new claim with supporting facts - <i>composing your article as separate groups of claim, facts, and optional explanations to offer more detail on interpreting facts, helps to structure and clarify your arguments</i>", recArr));
  }

  // RULE: if preceded by a Claim, Fact/evidence, or Explanation, suggest another Fact/evidence
  if(/[CFX]$/.test(pStr)) {
    var recArr = [new TextBlock("Use a fact to justify the claim.", "Fact/evidence")];
    recSetArr.push(createRecBlock("Add additional fact/evidence to justify this claim - <i>all claims should be supported by credible evidence</i>", recArr));
  }

  // RULE: if preceded by a Fact/evidence, suggest an Explanation for that Fact/evidence
  if(/F$/.test(pStr)) {
    var recArr = [new TextBlock("Elaborate on the fact/evidence just presented, e.g. the collection or analytical mechanisms.", "Explanation")];
    recSetArr.push(createRecBlock("Explain nature of fact/evidence just presented - <i>more complex facts often need additional explanation or clarification</i>", recArr));
  }

  // TODO: add rule for adding conclusion after F or O

  // RULE: story may end with an article conclusion if we already have at least one claim
  // but to avoid duplicating recommending this claim twice (see above), don't recommend this
  // if we've already reached MAX_CLAIMS
  if(!/Z$/.test(pStr) && (nStr === "") && (pStr.split('C').length-1 >= 1) && (pStr.split('C').length-1 < MAX_CLAIMS)) {
    var recArr = [new TextBlock("Provide a lead-out summary of the main conclusions in the article.", "Article conclusion")];
    recSetArr.push(createRecBlock("Add article conclusion - <i>you have presented one claim, you may conclude your article</i>", recArr));
  }

  /*
   * End of rule definitions
   */

  return recSetArr;
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

/**
 * Helper function to create a recommendations block with set of recommendations and reason for them being suggested.
 * @param {string} reason - Summary of recommendation and optionally a reason for why the given rule was triggered
 * @param {Array} recSet - Set of recommendations suggested by the given rule being triggered
 * @returns {{reason: *, recommendations: *}} - object with reason and recommendation set
 */
function createRecBlock(reason, recSet) {
  return { 'reason': reason, 'recommendations': recSet };
}