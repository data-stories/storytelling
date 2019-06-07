
function newStory(){
	if(window.confirm('This will discard any unsaved changes to the current story. Proceed?')){
		//I was going to manually reset all the stored data and re-init all of the fields with jQuery, but this is a much easier, lazier, way of doing it
		location.reload();
	}
}


function saveStory(){
	//TODO: Save data, story, etc. etc. as a custom data file
}


function loadStory(){
	if(window.confirm('This will discard any unsaved changes to the current story. Proceed?')){
		$('#story-upload').click();
	}
	//TODO: Reinitialise data, story, etc. etc.
}