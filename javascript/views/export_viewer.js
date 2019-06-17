
$(document).ready(function(){
	$(".export-form").on('keyup paste change', generatePreview);
})


function generatePreview(){

	var preview = $("#export-preview");

	// if(Story.instance.blocks.length <= 0){
	// 	preview.val("This story has no content! Go back and create at least one block");
	// 	return;		
	// }

	Story.instance.title = $("#export-title").val();
	Story.instance.author = $("#export-author").val();

	var out;
	switch($("#export-format").val()){
		case "html": out = storyToHTML(); break;
		case "story": out = storyToDS(); break;
		default: throw new Error("Unexpected export option selected: "+$("#export-format").val()); break;
	}

	preview.val(out);
	preview.height("0px");
	preview.height((preview[0].scrollHeight + 3) + "px");
}


function storyToHTML(){
	var out = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>`+Story.instance.title+`</title>
    <meta name="author" content="`+Story.instance.author+`">
  </head>
  <body>
  `;
	Story.instance.blocks.forEach(function(storyBlock){
		if(storyBlock instanceof TextBlock){
			out += "<p>"+storyBlock.content+"</p>\n";
		}
		else if(storyBlock instanceof ChartBlock){
			out += "<div>"+storyBlock.content+"</div>\n";
		}
	});
	out += `
  </body>
</html>`;

	return out;
}


function storyToDS(){
	return JSON.stringify(Story.instance, null, 4);
}


function downloadStory() {

	var data = $("#export-preview").val();
	var filename = $("#export-file").val();
	var type = $("#export-format").val();

	//TODO: Errors!
	if(Story.instance.blocks.length <= 0){
		return;		
	}

	if(!filename){
		filename = "datastory";	
	}

	filename += "." + type;
	
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
} 