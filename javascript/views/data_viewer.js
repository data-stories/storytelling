$(document).ready(function(){
  $("#file-upload").change(function(){
    $("#data-view").addClass("text-center");
    $("#data-view").empty();
    $("#data-view").append($('<img src="static/images/spinner.gif">'));
    Story.createFromDataFile(document.querySelector('input#file-upload').files[0], function(){
      dependencies();
      dataView(); 
    });
  });
});

function dataViewInit(){
  //This method intentionally left blank
}

function dataViewLeave(){

  Story.instance.metadata.interests = {}
  $(".field-of-interest:checkbox:checked").each(function(){
    //Story.instance.metadata.interests.push($(this).data('field'));
    var field = $(this).data('field').toString();
    Story.instance.metadata.interests[field] = $('#field-type-'+field.replace(" ", "-")).val();
  });

  Story.instance.metadata.dependencies = []
  Array.from($("#dependency-list").children()).forEach(function(dependency){
    Story.instance.metadata.dependencies.push({
      "independent" : $(dependency).children(".independent").html(),
      "dependent"   : $(dependency).children(".dependent").html()
    });
  });
}


function dependencies(){

  $("#dependencyForm").show();
  $("#independent-dropdown").empty();
  $("#dependent-dropdown").empty();

  Story.instance.data.headers.forEach(function(header, index){
    $("#independent-dropdown").append(new Option(header, index));
    $("#dependent-dropdown").append(new Option(header, index));
  });

  $('#dependent-dropdown').val(1).change();
}

function createDependency(){

    //If duplicate selection
    if($( "#independent-dropdown option:selected" ).text() == $( "#dependent-dropdown option:selected" ).text()){
      $("#dependency-error").text("Field cannot depend on itself");
      $("#dependency-error").show();
      return;
    }

    //If dependency already exists
    if( $("#dependency-"+$( "#independent-dropdown option:selected" ).val() +'-'+ $( "#dependent-dropdown option:selected" ).val()).length){
      $("#dependency-error").text("This dependency already exists");
      $("#dependency-error").show();
      return;
    }

    //If there are NO errors, clear the error message
    $("#dependency-error").text("");
    $("#dependency-error").hide();

    var dependencyList = `
      <li id="dependency-`+$( "#independent-dropdown" ).val()+`-`+$( "#dependent-dropdown" ).val()+`"><span class="independent">`+$( "#independent-dropdown option:selected" ).text()+`</span>&nbsp;<i class="fas fa-arrow-right"></i>&nbsp;<span class="dependent">`+$( "#dependent-dropdown option:selected" ).text()+`</span><a href="#" onClick="removeDependency('`+$( "#independent-dropdown" ).val()+`-`+$( "#dependent-dropdown" ).val()+`');"><i class="fas fa-backspace"></i></a></li>`;
  $("#dependency-list").append(dependencyList);
}

function removeDependency(index){
  $("#dependency-"+index).remove();
  $("#dependency-error").text("");
  $("#dependency-error").hide();
}

function revertDependencies(){
  //TODO: Add a user-friendly "Are you sure?" message
  $("#dependency-list").empty();
  $("#dependency-error").text("");
  $("#dependency-error").hide();
}


function dataView(){

  $("#data-view").removeClass("text-center");
    $("#data-view").empty();

  var dataView = `
  <table class="table table-striped">
    <colgroup>
       <col span="1" style="width: 20%;">
       <col span="1" style="width: 20%;">
       <col span="1" style="width: 30%;">
       <col span="1" style="width: 10%;">
       <col span="1" style="width: 10%;">
       <col span="1" style="width: 10%;">
    </colgroup>
    <thead>
      <tr>
        <th scope="col">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="field-of-interest-all">
            <label class="form-check-label" for="field-of-interest-all">
              Field
            </label>
          </div>
        </th>
        <th scope="col">Datatype</th>
        <th scope="col">Example Values</th>
        <th scope="col">Min.</th>
        <th scope="col">Max.</th>
        <th scope="col">Distribution</th>
      </tr>
    </thead>
    <tbody>`;

  Story.instance.data.headers.forEach(function(header, index){

    //TODO: There must be a more efficient way d3 can do this
    var values = [];
    Story.instance.data.rawData.forEach(function(row){
      values.push(parseFloat(row[header]));
    });

    min = d3.min(values);
    max = d3.max(values);

    if(min == undefined){
      min = "n/a";
      max = "n/a";
    }

    dataView += `
      <tr>
        <td>
          <div class="form-check">
            <input class="form-check-input field-of-interest" type="checkbox" value="" data-field="`+header+`" id="field-of-interest-`+index+`">
            <label class="form-check-label" for="field-of-interest-`+index+`">
              `+header+`
            </label>
          </div>
        </td>
        <td>
          <select class="custom-select" id="field-type-`+header.replace(" ", "-")+`">`;
          if (detectColumnType(header) == "String"){
            dataView += `<option value="string" selected>String</option>`;
          }
          else{
            dataView += `<option value="string">String</option>`;
          }

          if (detectColumnType(header) == "Float"){
            dataView += `<option value="float" selected>Float</option>`;
          }
          else{
            dataView += `<option value="float">Float</option>`;
          }

          if (detectColumnType(header) == "Integer"){
            dataView += `<option value="integer" selected>Integer</option>`;
          }
          else{
            dataView += `<option value="integer">Integer</option>`;
          }

          if (detectColumnType(header) == "Date/Time"){
            dataView += `<option value="datetime" selected>Date/Time</option>`;
          }
          else{
            dataView += `<option value="datetime">Date/Time</option>`;
          }

          dataView += `
          </select>
        </td>
        <td>`+getExampleValues(header)+`</td>
        <td>`+min+`</td>
        <td>`+max+`</td>
        <td><a onClick="modalSparkline('`+header+`')">`+getSparkline(header)+`</a></td>
      </tr>`;

  });

  dataView += ` 
    </tbody>
  </table>
  <!--<p>Containing Errors: None</p>-->
  <p>Number of fields: `+Story.instance.data.headers.length+`</p>
  <p>Number of rows: `+Story.instance.data.rawData.length+`</p>`;

  $("#data-view").html(dataView);


  $('.sparkline').sparkline('html', {type: 'bar', barColor: '#007bff', disableInteraction:true} );

  $('#field-of-interest-all').click(function(event) {   
    if(this.checked) {
        // Iterate each checkbox
        $('.field-of-interest').each(function() {
            this.checked = true;                        
        });
    } else {
        $('.field-of-interest').each(function() {
            this.checked = false;                       
        });
    }
  });

  $('#field-of-interest-all').click(); 

  $("#continue-row").show();

}


function getSparkline(header){

  if(detectColumnType(header) == "Float" || detectColumnType(header) == "Integer"){

    var bins = getSparks(header);
    
    var sparks = "";
    bins.forEach(function(element){
      sparks += element.length + ","
    })
    sparks = sparks.slice(0, -1);

    return `<span class="sparkline">`+sparks+`</span>`;
  }
  else{
    return "n/a";
  }

}

function getSparks(header){

  assert((detectColumnType(header) == "Float" || detectColumnType(header) == "Integer"), "Can't get sparks for non-numeric column");

  var values = [];
  Story.instance.data.rawData.forEach(function(row, index){
    values.push(parseFloat(row[header]));
  });

  var histGenerator = d3.histogram()
    .domain([d3.min(values), d3.max(values)])
    .thresholds(10);

  return histGenerator(values);
}

function modalSparkline(header){
  var spark = getSparkline(header);
  if(spark == "n/a"){
    return;
  }
  var spark = $(spark);
  spark.addClass("modalSparkline");
  $("#modalSparkline").html(spark);
  $("#modalSparkline").modal();
  $('.modalSparkline').sparkline('html', {type: 'bar', barColor: '#007bff', barWidth: (700/getSparks(header).length)+'px', height: '500px'} );
  $("#modalSparkline").width(800);
  $("#modalSparkline").height(600);
}


// TODO: move this to Data class.
function getExampleValues(header, examples=4){

  var values = [];
  var maxExamples = (Story.instance.data.rawData.length >= examples) ? examples : Story.instance.data.rawData.length;
  var exampleIndexes = [];

  for(let i=0; i < maxExamples; i++){

    var index = Math.floor(Math.random() * Story.instance.data.rawData.length);

    //Don't show duplicate indexes (i.e. the same cell more than once)
    //TODO: Don't show *any* duplicate *values*
    while(index in exampleIndexes){
      index = Math.floor(Math.random() * Story.instance.data.rawData.length);
    }
    exampleIndexes.push(index);

    values.push(Story.instance.data.rawData[index][header]);
  }

  return values.sort().join(", ");

}


function detectColumnType(header){

  var types = {};

  Story.instance.data.rawData.forEach(function(row, index){

    type = getType(row[header])

    if(!types[type]){
      types[type] = 1
    }
    else{
      types[type] += 1
    }

  });

  type = Object.keys(types).reduce((a, b) => types[a] > types[b] ? a : b);
  return type.charAt(0).toUpperCase() + type.slice(1);

}

function getType(datum){
  
  if(!isNaN(datum)){

    if(datum.includes(".")){
      return "Float";
    }
    else{
      return "Integer";  
    }
  }
  else if (Date.parse(datum))
  {
    return "Date";
  }
  else {
    return "String";
  }
}


function datasetSummary(){

  var datasetSummary = `
  <!--<p>Containing Errors: None</p>-->
  <p>Number of fields: `+Story.instance.data.headers.length+`</p>
  <p>Number of rows: `+Story.instance.data.rawData.length+`</p>`;

  $("#dataset-summary").html(datasetSummary);

}