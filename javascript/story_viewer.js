function validateStory(){

  //TODO: Actually validate that sensible options have been chosen
  var storyIsValid = true;

  if(storyIsValid){
    $('#nav-export').find("a").removeClass("disabled");
    switchView('export');
  }
  else{
    //TODO: explain to the user what has gone wrong
  }

}