function validateTemplate(){

  //TODO: Actually validate that sensible options have been chosen
  var templateIsValid = true;

  if(templateIsValid){
    $('#nav-story').find("a").removeClass("disabled");
    switchView('story');
  }
  else{
    //TODO: explain to the user what has gone wrong
  }

}