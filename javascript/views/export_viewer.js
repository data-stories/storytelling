
$(document).ready(function(){
	//$(".export-form").on('keyup paste change', generatePreview);
})


function exportViewInit(){
    generatePreview();
}

onPageEnter["export"] = exportViewInit;


function generatePreview(){

    var preview = $("#export-preview");
    preview.empty();

    if(Story.instance.blocks.length <= 0){
        preview.text("This story has no content! Go back and create at least one block");
        return;        
    }

	var out = storyToRawHTML();
	// switch($("#export-format").val()){
	// 	case "raw-html": out = storyToRawHTML(); break;
    //  case "magazine-html": out = storyToMagazineHTML(); break;
    //  case "slide-html": out = storyToSlideHTML(); break;
	// 	case "story": out = storyToDS(); break;
	// 	default: throw new Error("Unexpected export option selected: "+$("#export-format").val()); break;
	// }

	preview.html(out);
	//Scale down charts for preview
	preview.find('svg').each(function(index, element){
		$(this).attr('width', $(this).attr('width')/3);
		$(this).attr('height', $(this).attr('height')/3);

		$(this).children('g').attr('transform', $(this).children('g').attr('transform')+' scale(0.33)');
	})


	preview.height("0px");
	preview.height((preview[0].scrollHeight + 3) + "px");
}