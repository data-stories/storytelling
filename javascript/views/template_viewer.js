

function templateViewInit(){

  //If the current story is empty, apply the default story template
  if(Story.instance.blocks.length == 0){
    defaultTemplate();
    $("#default-template")
      .removeClass("btn-secondary")
      .addClass("btn-primary")
      .addClass("active")
      .attr("aria-pressed", "true");
  }
}


function templateViewLeave(){

}


function defaultTemplate(){
    Story.instance.blocks.push(new TextBlock("Introduction your story here; talk about the background, the context, and why it matters to your audience"));

    Story.instance.metadata.dependencies.forEach(function(dependency){
        Story.instance.blocks.push(new TextBlock("Introduce the independent variable (\""+dependency.independant+"\") here; talk about what it is, why it matters, and so on."));
        Story.instance.blocks.push(new TextBlock("Introduce the dependent variable (\""+dependency.dependant+"\") here; talk about what it is, why it matters, and so on."));
        Story.instance.blocks.push(new ChartBlock());
        Story.instance.blocks.push(new TextBlock("Explain the relationship between the two variables, and reference the correlation or trend visualised above."));
    });
    
    Story.instance.blocks.push(new TextBlock("Conclude your story; summaries the key points you have made and again, emphasise why it is important to your audience."));
}

function changeTemplate(setTemplate){

  if(window.confirm('This will reset the current story to the new template. Proceed?')){
    setTemplate();
  }
}