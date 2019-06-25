
function storyViewInit(){

  Story.instance.blocks.forEach(function(block){
    $("#story-sections").append(newSection(block.renderToAuthor()));

    $("#story-sections").append($('<button class="btn btn-primary btn-sm btn-add"><i class="fas fa-plus"></i></button>').click(function(){
      $(this).after(newSection());
      $(this).remove();
    }));
  });
}


function storyViewLeave(){
  //TODO: Save story!!!

  Story.instance.blocks = [];
  Array.from($(".story-block").children()).forEach(function(element){

    element = $(element);
    console.log(element);

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

  console.log(Story.instance);
}


function newSection(blockContent){

  var block = $('<div class="story-block">');

  if(!blockContent){
    block
      .append($('<button class="btn btn-primary btn-story-block"><i class="fas fa-file-alt"></i> Text</button>')
        .click(function(){
          $(this).parent().after(newSection(new TextBlock().renderToAuthor()));
          $(this).parent().remove();
          //TODO: Create "new block" buttons between each block
        })
      );

    block
      .append($('<button class="btn btn-primary btn-story-block"><i class="fas fa-chart-bar"></i> Chart</button>')
        .click(function(){
          $(this).parent().after(newSection(new ChartBlock().renderToAuthor()));
          $(this).parent().remove();
          //TODO: Create "new block" buttons between each block
        })
      );

    block
      .append($('<button class="btn btn-primary btn-story-block"><i class="fas fa-table"></i> Data</button>')
        .click(function(){
          $(this).parent().after(newSection(new DataBlock().renderToAuthor()));
          $(this).parent().remove();
          //TODO: Create "new block" buttons between each block
        })
      );

  }
  else{
    block.append($('<button class="btn btn-sm btn-danger trash-button"><i class="fas fa-trash-alt"></i></button>').click(function(){
      $(this).parent().remove();
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