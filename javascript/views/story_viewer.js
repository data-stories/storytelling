

function storyViewInit(){

  Story.instance.blocks.forEach(function(block){
    $("#story-sections").append(newSection(block.renderToAuthor()));
  });

  $("#story-sections").append(newSection());

  $("#story-sections").append($('<button class="btn btn-primary btn-sm btn-add"><i class="fas fa-plus"></i></button>').click(function(){
    $("#story-sections").append(newSection());
  }));

}


function storyViewLeave(){


  //TODO: Save story!!!
  $(".story-block")
  
}


function newSection(blockContent){

  var block = $('<div class="story-block">');



  if(!blockContent){
    block
      .append($('<button class="btn btn-primary btn-story-block"><i class="fas fa-file-alt"></i> Text</button>')
        .click(function(){
          $(this).parent().remove();
          $("#story-sections").append(newSection(new TextBlock().renderToAuthor()));
          //TODO: Create "new block" buttons between each block
        })
      );

    block
      .append($('<button class="btn btn-primary btn-story-block"><i class="fas fa-chart-bar"></i> Chart</button>')
        .click(function(){
          $(this).parent().remove();
          $("#story-sections").append(newSection(new ChartBlock().renderToAuthor()));
          //TODO: Create "new block" buttons between each block
        })
      );

    block
      .append($('<button class="btn btn-primary btn-story-block"><i class="fas fa-table"></i> Data</button>')
        .click(function(){
          $(this).parent().remove();
          $("#story-sections").append(newSection(new DataBlock().renderToAuthor()));
          //TODO: Create "new block" buttons between each block
        })
      );

  }
  else{
    block.append($('<button class="btn btn-sm btn-danger trash-button"><i class="fas fa-trash-alt"></i></button>').click(function(){
      $(this).parent().remove();
      //TODO: ALSO DELETE THE BLOCK FROM STORY.INSTANCE!!!
      //We don't need to do this if, WHENEVR WE LEAVE THIS PAGE, it regenerates the Story.instance.blocks
    }));
    block.append($(blockContent));
  }

  return block;
}


function createBlock(container, block){

  blockContainter.append(block.render)
  Story.instance.blocks.push(block);

  anchor.parent().remove();

  
}