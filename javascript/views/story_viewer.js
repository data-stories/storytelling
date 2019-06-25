
function storyViewInit(){

  $("#story-sections")
    .empty()
    .append(createAddSectionButton());

  Story.instance.blocks.forEach(function(block){
    $("#story-sections")
      .append(newSection(block.renderToAuthor()))
      .append(createAddSectionButton());
  });
}


function storyViewLeave(){

  Story.instance.blocks = [];
  Array.from($(".story-block").children()).forEach(function(element){
    element = $(element);

    var storyBlock;
    if(element.hasClass("text-block")){
      storyBlock = new TextBlock(element.val());
    }
    else if(element.hasClass("chart-block")){
      storyBlock = new ChartBlock(element.html());
    }
    else if(element.hasClass("data-block")){
      storyBlock = new DataBlock(element.html());
    }


    if(storyBlock){
      Story.instance.blocks.push(storyBlock);
    }
  });
}


function newSection(blockContent){

  var block = $('<div class="story-block">');

  if(!blockContent){
    block
      .append($('<button class="btn btn-primary btn-story-block"><i class="fas fa-file-alt"></i> Text</button>')
        .click(function(){
          insertEmptySection($(this).parent(), newSection(new TextBlock().renderToAuthor()));
        })
      )
      .append($('<button class="btn btn-primary btn-story-block"><i class="fas fa-chart-bar"></i> Chart</button>')
        .click(function(){
          insertEmptySection($(this).parent(), newSection(new ChartBlock().renderToAuthor()));
        })
      )
      .append($('<button class="btn btn-primary btn-story-block"><i class="fas fa-table"></i> Data</button>')
        .click(function(){
          insertEmptySection($(this).parent(), newSection(new DataBlock().renderToAuthor()));
        })
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
