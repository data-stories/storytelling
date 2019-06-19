
var template = []

function templateViewInit(){

}


function templateViewLeave(){
  //TODO: allow the user to actually CHOOSE a template
  defaultTemplate();
  Story.instance.blocks = template;
}


function defaultTemplate(){
    template.push(new TextBlock("Introduction your story here; talk about the background, the context, and why it matters to your audience"));

    Story.instance.metadata.dependencies.forEach(function(dependency){
        template.push(new TextBlock("Introduce the independent variable (\""+dependency.independant+"\") here; talk about what it is, why it matters, and so on."));
        template.push(new TextBlock("Introduce the dependent variable (\""+dependency.dependant+"\") here; talk about what it is, why it matters, and so on."));
        template.push(new ChartBlock());
        template.push(new TextBlock("Explain the relationship between the two variables, and reference the correlation or trend visualised above."));
    });
    
    template.push(new TextBlock("Conclude your story; summaries the key points you have made and again, emphasise why it is important to your audience."));
}