
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
  /* TODO: remove this when rule-based system complete
  Story.instance.blocks = [];

  $(".story-block").each(function(){

    var storyBlock;
    var block = $(this).find('div');
    
    if(block.hasClass("text-block")){
      storyBlock = new TextBlock(block.find('textarea').val());
    }
    else if(block.hasClass("chart-block")){
      storyBlock = new ChartBlock(block.html());
    }
    else if(block.hasClass("image-block")){
      storyBlock = new ImageBlock(block.find('.image-caption').val(), $(this).find('.image-url').val());
    }
    else if(block.hasClass("data-block")){
      storyBlock = new DataBlock(block.html());
    }

    if(storyBlock){
      Story.instance.blocks.push(storyBlock);
    }
  });
  */
}

onPageLeave["story"] = storyViewLeave;


//TODO: add doc
function getCurrentStory(prevSections, nextSections) {

  var currentStory = [];
  var foundActive = false;

  $(".story-block").each(function() {
    var storyBlock;
    var block = $(this).find('div');

    // Have we found an active story block, i.e. the recommend button has been pressed?
    if ($(this).data('data-rec-selected') === true) {
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

    block
      .append($('<button class="btn btn-primary btn-story-block"><i class="fas fa-file-alt"></i> Recommend</button>')
        .click(function(){
          //TODO: Replace this with a proper rule-based dynamic template system
          $(this).parent().data('data-rec-selected', true);

          var recommendedBlock = storyTemplate.shift();
          var blockClass;
          if(recommendedBlock instanceof TextBlock){
            blockClass = "text-block";
          }
          else if(recommendedBlock instanceof ImageBlock){
            blockClass = "image-block";
          }
          else if(recommendedBlock instanceof ChartBlock){
            blockClass = "chart-block";
          }
          if(recommendedBlock instanceof DataBlock){
            blockClass = "data-block";
          }

          var recs = getRuleBasedRecommendations();
          $(this).parent().data('data-rec-selected', false);

          // TODO: add in selectable recommendations to a list UI element

          $(this).parent().parent().addClass(blockClass);
          insertEmptySection($(this).parent(), newSection(recommendedBlock.renderToAuthor()));
        })
        //Disable the button if there's nothing in the recommender queue
        //TODO: replace the queue with a rule based system that takes into account previous and subsequent StoryBlocks
        .prop('disabled', storyTemplate.length == 0)
      )

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


function insertEmptySection(container, section){
  container
    .after(createAddSectionButton())
    .after(section)
    .after(createAddSectionButton())
    .remove();
}

function createAddSectionButton(){
  return $('<button class="btn btn-primary btn-sm btn-add"><i class="fas fa-plus"></i></button>').click(function(){
    $(this)
      .after(newSection())
      .remove();
  });
}
