function validateStory(){

  //TODO: Actually validate that sensible options have been chosen
  var storyIsValid = true;

  if(storyIsValid){
    $('#nav-export').find("a").removeClass("disabled");
    switchView('export');

    if(Story.instance.title){
    	$("export-title").val(Story.instance.title)
    }

    if(Story.instance.author){
    	$("export-author").val(Story.instance.author)	
    }
    generatePreview();
  }
  else{
    //TODO: explain to the user what has gone wrong
  }

}