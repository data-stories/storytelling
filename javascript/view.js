var currentView = "data";
var VALID_VIEWS = ["data", "interest", "template", "story", "export"];

function switchView(view){

    if(!VALID_VIEWS.includes(view)){
      throw new Error("Invalid view: "+view);
    }

    $("#"+currentView).toggle();
    $("#"+view).toggle();
    $("#nav-"+currentView).removeClass("active");
    $("#nav-"+view).addClass("active");

    currentView = view;
}