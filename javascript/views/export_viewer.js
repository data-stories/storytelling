
$(document).ready(function(){
	$(".export-form").on('keyup paste change', generatePreview);
})


function exportViewInit(){
    generatePreview();
}

onPageEnter["export"] = exportViewInit;


function generatePreview(){

    var preview = $("#export-preview");

    if(Story.instance.blocks.length <= 0){
        preview.val("This story has no content! Go back and create at least one block");
        return;        
    }

	var out;
	switch($("#export-format").val()){
		case "raw-html": out = storyToRawHTML(); break;
        case "magazine-html": out = storyToMagazineHTML(); break;
        case "slide-html": out = storyToSlideHTML(); break;
		case "story": out = storyToDS(); break;
		default: throw new Error("Unexpected export option selected: "+$("#export-format").val()); break;
	}

	preview.val(out);
	preview.height("0px");
	preview.height((preview[0].scrollHeight + 3) + "px");
}