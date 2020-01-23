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

    try{
        onPageLeave[currentView]();
    }
    catch{// (e if e instanceof TypeError){
        console.warn("No cleanup code for leaving page '"+currentView+"'")
    }


    try{
        onPageEnter[view]();
    }
    catch{// (e if e instanceof TypeError){
        console.warn("No cleanup code for entering page '"+view+"'")
    }
    

    currentView = view;
}