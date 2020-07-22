function storyToRawHTML(){
    var out = '<div class="data-story">\n';
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


function downloadStory(data, filename, type) {

    data = data || storyToDS();
    filename = filename || Story.instance.metadata.title || "Untitled Data Story";
    type = type || "story";

    if(Story.instance.blocks.length <= 0){
        //TODO: Errors!
        return;     
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