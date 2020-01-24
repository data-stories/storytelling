const VALID_VIEWS = ["data", "analysis", "story", "export"];

var currentView = "data";
var onPageEnter = {}
var onPageLeave = {}


function switchView(view){

    if(!VALID_VIEWS.includes(view)){
      throw new Error("Invalid view: "+view);
    }

    $("#"+currentView).toggle();
    $("#"+view).toggle();
    $("#nav-"+currentView).removeClass("active");
    $("#nav-"+view).addClass("active");
    $('#nav-'+view).find("a").removeClass("disabled");


    //Call the cleanup code for this page
    if(currentView in onPageLeave){
        onPageLeave[currentView]();
    }
    //If we've tried to call a function that doesn't exist throw a warning. Maybe it's fine, if there's no cleanup code.
    else{
        console.warn("No cleanup code for leaving page '"+currentView+"'");
    }


    //Call the setup code for the new page
    if(view in onPageEnter){
        onPageEnter[view]();
    }
    //If we've tried to call a function that doesn't exist throw a warning. Maybe it's fine, if there's no setup code.
    else{
        console.warn("No setup code for entering page '"+view+"'");
    }
    

    currentView = view;
}