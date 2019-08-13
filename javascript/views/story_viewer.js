
function storyViewInit(){

  if(Story.instance.title){
      $("#export-title").val(Story.instance.metadata.title);
  }

  if(Story.instance.author){
      $("#export-author").val(Story.instance.metadata.author);
  }

  //TODO: Replace this with a proper dynamic template system
  if(Story.instance.blocks.length == 0){
    Story.instance.blocks.push(new TextBlock("Introduce your story here; talk about the background, the context, and why it matters to your audience"));
    Story.instance.metadata.dependencies.forEach(function(dependency){
        Story.instance.blocks.push(new TextBlock("Introduce the independent variable (\""+dependency["independent"]+"\") here; talk about what it is, why it matters, and so on."));
        Story.instance.blocks.push(new TextBlock("Introduce the dependent variable (\""+dependency["dependent"]+"\") here; talk about what it is, why it matters, and so on."));
        Story.instance.blocks.push(new ChartBlock());
        Story.instance.blocks.push(new TextBlock("Explain the relationship between the two variables, and reference the correlation or trend visualised above."));
    });
    Story.instance.blocks.push(new TextBlock("Conclude your story; summaries the key points you have made and again, emphasise why it is important to your audience."));
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


function storyViewLeave(){

  Story.instance.metadata.title = $("#export-title").val();
  Story.instance.metadata.author = $("#export-author").val();

  Story.instance.blocks = [];
  $(".story-block").children().each(function(){

    var storyBlock;
    if($(this).hasClass("text-block")){
      storyBlock = new TextBlock($(this).val());
    }
    else if($(this).hasClass("chart-block")){
      storyBlock = new ChartBlock($(this).html());
    }
    else if($(this).hasClass("data-block")){
      storyBlock = new DataBlock($(this).html());
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
      .append($('<button class="btn btn-primary btn-story-block"><i class="fas fa-image"></i> Image</button>')
        .click(function(){
          //TODO: Upload image?
        })
        .prop('disabled', true)
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
