
$(document).ready(function(){
	$(".export-form").on('keyup paste change', generatePreview);
})


function exportViewInit(){
    if(Story.instance.title){
        $("#export-title").val(Story.instance.metadata.title);
    }

    if(Story.instance.author){
        $("#export-author").val(Story.instance.metadata.author);
    }

    generatePreview();
}

function exportViewLeave(){
  //This method intentionally left empty
}


function generatePreview(){

    var preview = $("#export-preview");

    if(Story.instance.blocks.length <= 0){
        preview.val("This story has no content! Go back and create at least one block");
        return;        
    }

	Story.instance.metadata.title = $("#export-title").val();
	Story.instance.metadata.author = $("#export-author").val();

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


function storyToRawHTML(){
    var out = '<div class="data-story>\n';
    Story.instance.blocks.forEach(function(block){
        out += '  '+block.renderToHTML() + '\n';
    });
    out += `</div>`;
    return out;
}

function storyToMagazineHTML(){
    var out = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>`+Story.instance.metadata.title+`</title>
    <meta name="author" content="`+Story.instance.metadata.author+`">
  </head>
  <body>
  `;
    Story.instance.blocks.forEach(function(block){
        out += block.renderToHTML() +'\n';
    });
    out += `
  </body>
</html>`;

    return out;
}

function storyToSlideHTML(){
    var out = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>`+Story.instance.metadata.title+`</title>
    <meta name="author" content="`+Story.instance.metadata.author+`">
  </head>
  <body>
    <div class="reveal">
      <div class="slides">
  `;
    Story.instance.blocks.forEach(function(block){
        out += `    <section>`+block.renderToHTML() + `</section>\n`;
    });
    out += `
      </div>
    </div>
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

    if(type.includes("html")){
        type = "html";
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