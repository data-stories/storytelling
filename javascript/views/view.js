var currentView = "data";
var VALID_VIEWS = ["data", "story", "export"];

function switchView(view){

    if(!VALID_VIEWS.includes(view)){
      throw new Error("Invalid view: "+view);
    }

    $("#"+currentView).toggle();
    $("#"+view).toggle();
    $("#nav-"+currentView).removeClass("active");
    $("#nav-"+view).addClass("active");
    $('#nav-'+view).find("a").removeClass("disabled");

    //Okay I admit this is probably a REALLY horrible way of doing this, and if you can think of a better way, I'll all ears :p
    eval(currentView+"ViewLeave()");
    eval(view+"ViewInit()");

    //Perhaps something like this is better:

    //var leave = {"data" : dataViewLeave, "interest" : interestViewLeave, ...}
    //leave[currentView]();
    //var init = {"data" : dataViewInit, "interest" : interestViewInit, ...}
    //init[view]();

    currentView = view;
}