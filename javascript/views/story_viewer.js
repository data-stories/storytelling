
function storyViewInit(){

  if(Story.instance.title){
      $("#export-title").val(Story.instance.metadata.title);
  }

  if(Story.instance.author){
      $("#export-author").val(Story.instance.metadata.author);
  }

  $("#story-sections")
    .empty()
    .append(createAddSectionButton());

  Story.instance.blocks.forEach(function(block){
    $("#story-sections")
      .append(newSection(block.renderToAuthor()))
      .append(createAddSectionButton());
  });
}

onPageEnter["story"] = storyViewInit;


function storyViewLeave(){

  Story.instance.metadata.title = $("#export-title").val();
  Story.instance.metadata.author = $("#export-author").val();

  Story.instance.blocks = getCurrentStory(true, true);
}

onPageLeave["story"] = storyViewLeave;


/**
 * Obtain the current story from the UI in terms of StoryBlocks, returning either (or both) of the sections prior
 * and subsequent to the seelction point in the story the 'Recommendation' button is pressed.
 * @param {boolean} prevSections - whether the sections prior to the selection point are included
 * @param {boolean} nextSections - whether the sections subsequent to the selection point are included
 * @param {string} container - optional DOM element to use as marker to determine prev/next sections
 * @returns {Array} currentStory - the current story as an array of StoryBlocks
 */
function getCurrentStory(prevSections, nextSections, container) {

  var currentStory = [];
  var foundActive = false;

  $(".story-block").each(function() {
    var storyBlock;
    var block = $(this).find('div');

    // Have we found our optional active story block, i.e. the recommend button has been pressed at this point?
    if ($(this).is(container)) {
      foundActive = true;
    }

    // If we're after the preceding story blocks before an active block, and an active block hasn't been found, add it
    // or if we're after the subsequent story blocks after an active block, and it has been found, add it
    if ((prevSections && !foundActive) || (nextSections && foundActive)) {
      if (block.hasClass("text-block")) {
        // Ensure we also capture the user-selected CFO pattern type of the text block
        var selectedCFOType = block.find('select').children("option:selected").val();
        storyBlock = new TextBlock(block.find('textarea').val(), selectedCFOType);
      } else if (block.hasClass("chart-block")) {
        storyBlock = new ChartBlock(block.html());
      } else if (block.hasClass("image-block")) {
        storyBlock = new ImageBlock(block.find('.image-caption').val(), $(this).find('.image-url').val());
      } else if (block.hasClass("data-block")) {
        storyBlock = new DataBlock(block.html());
      }

      if (storyBlock) {
        currentStory.push(storyBlock);
      }
    }
  });

  return currentStory;
}


function newSection(blockContent){

  var block = $('<div class="story-block">');

  if(!blockContent){
    block.append($('<button class="btn btn-sm btn-danger trash-button"><i class="fas fa-trash-alt"></i></button>').click(function(){
      $(this).parent().after(createAddSectionButton());
      $(this).parent().remove();
    }));

    // NB: recommendations will be added here after the block has been created - see createAddSectionButton()

    block
      .append($('</br>'))
      .append($('<button class="btn btn-primary btn-story-block"><i class="fas fa-file-alt"></i> Text</button>')
        .click(function(){
          $(this).parent().parent().addClass('text-block');
          insertEmptySection($(this).parent(), newSection(new TextBlock("", "").renderToAuthor()));
        })
      )
      .append($('<button class="btn btn-primary btn-story-block"><i class="fas fa-image"></i> Image</button>')
        .click(function(){
          $(this).parent().addClass('image-block');
          insertEmptySection($(this).parent(), newSection(new ImageBlock().renderToAuthor()));
        })
      )
      .append($('<button class="btn btn-primary btn-story-block"><i class="fas fa-chart-bar"></i> Chart</button>')
        .click(function(){
          $(this).parent().addClass('chart-block');
          insertEmptySection($(this).parent(), newSection(new ChartBlock().renderToAuthor()));
        })
      )
      .append($('<button class="btn btn-primary btn-story-block"><i class="fas fa-table"></i> Data</button>')
        .click(function(){
          $(this).parent().addClass('data-block');
          insertEmptySection($(this).parent(), newSection(new DataBlock().renderToAuthor()));
        })
        .prop('disabled', true)
      );
  }
  else{
    block.append($('<button class="btn btn-sm btn-danger trash-button"><i class="fas fa-trash-alt"></i></button>').click(function(){
      $(this).parent().next(".btn-add").remove();
      $(this).parent().remove();
    }));
    block.append($(blockContent));
  }

  return block;
}

/**
 * Obtain and add recommendations to the new section panel based on where we are in the story
 * when the user clicked the recommendations button.
 * @param container - the StoryBlock new section panel that will contain the list of recommendations
 */
function addRecommendationOptions(container) {
  var recSetArr = getRuleBasedRecommendations(container);

  for (var rs = recSetArr.length-1; rs >= 0; rs--) {
    var recArr = recSetArr[rs];
    container.prepend($('<button class="btn btn-info btn-story-block w-75"><i class="fas fa-check-square"></i> ' + recArr.reason + '</button>')
      .click(function(recArr) {
        return function() {
          var recSet = recArr.recommendations;
          var container = $(this).parent();
          for (var rb = 0; rb < recSet.length; rb++) {
            var recommendedBlock = recSet[rb];
            if (recommendedBlock) {
              var blockClass;
              if (recommendedBlock instanceof TextBlock) {
                blockClass = "text-block";
              } else if (recommendedBlock instanceof ImageBlock) {
                blockClass = "image-block";
              } else if (recommendedBlock instanceof ChartBlock) {
                blockClass = "chart-block";
              }
              if (recommendedBlock instanceof DataBlock) {
                blockClass = "data-block";
              }

              // Add the recommendation before this container block, so multiple ones are inserted into
              // the story chain in the right order (and not backwards, as if we had used '.after')
              container.parent().addClass(blockClass);
              container
                .before(createAddSectionButton())
                .before(newSection(recommendedBlock.renderToAuthor()))
            }
          }
          container
            .after(createAddSectionButton())
            .remove();
        }
      }(recArr))
    );
  }
}

function insertEmptySection(container, section){
  container
    .after(createAddSectionButton())
    .after(section)
    .after(createAddSectionButton())
    .remove();
}

function createAddSectionButton(){
  return $('<button class="btn btn-primary btn-sm btn-add"><i class="fas fa-plus"></i></button>').click(function(){
    var newSec = newSection();

    $(this)
      .after(newSec)
      .remove();

    // Now the new section panel has been created, analysis and add recommendations to the panel
    // We can't do this in newSection(), since it's impossible to get a context of where
    // the block is being created in the story. We need context to provide recommendations
    // based on that story location context
    addRecommendationOptions(newSec);
  });
}
