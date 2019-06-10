function validateInterests(){

  //TODO: Actually validate that sensible options have been chosen
  var interestsAreValid = true;

  if(interestsAreValid){
    $('#nav-template').find("a").removeClass("disabled");
    switchView('template');
  }
  else{
    //TODO: explain to the user what has gone wrong
  }

}