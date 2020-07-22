$(document).ready(function(){
  $("#file-upload").change(function(){
    $("#data-view").hide();
    $("#data-view-loader").hide();
    $("#data-view-spinner").show();
    Story.createFromDataFile(document.querySelector('input#file-upload').files[0], function(){
      dependencies();
      dataView(); 
    });
  });

  $('#data-continue').click(function(){
    $('#data-continue').html('<img width="20px" height="20px" src="static/images/spinner.gif"> Loading...');

    //Include a (tiny) sleep, to give the button text a chance to update if needed
    setTimeout(() => { switchView('analysis'); }, 10);
    
  });
});


function dataViewInit(){
  $('#data-continue').html("Continue");
}

onPageEnter["data"] = dataViewInit;

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

onPageLeave["data"] = dataViewLeave;


function loadDemo(){
  $("#data-view").hide();
  $("#data-view-loader").hide();
  Story.instance = new Story();
  Story.instance.setData(new Data(demoData));
  dependencies();
  dataView();
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

  $("#data-view").empty();

  $("#data-view").append(

    //Add toggle buttons to show/hide raw/overview data
    $('<div>')
    .addClass('btn-group btn-group-toggle')
    .attr('data-toggle', 'buttons')
    .append(
      $('<label>')
      .addClass('btn btn-secondary active')
      .append(
        $('<input>')
        .attr('type', 'radio')
        .attr('autocomplete', 'off')
        .attr('checked', '')
      )
      .append("Raw Data")
    )
    .append(
      $('<label>')
      .addClass('btn btn-secondary')
      .append(
        $('<input>')
        .attr('type', 'radio')
        .attr('autocomplete', 'off')
      )
      .append("Overview")
    )
    .change(function(){
      $('#data-table').toggle();
      $('#overview-table').toggle();
    })
  );


  var dataTable = $('<table>')
    .addClass('table table-striped')
    .append($('<colgroup>'));

  var width = ((100 / Story.instance.data.headers.length) >= 10) ? (100 / Story.instance.data.headers.length) : 10;
  for(let i = 0; i < Story.instance.data.headers.length; i++){
    dataTable.children('colgroup')
      .append($('<col span="1" style="width: '+width+'%;">'));
  }


  dataTable.append($('<thead>').append($('<tr>')));
            
  Story.instance.data.headers.forEach(function(header, index){
    dataTable.children('thead').children('tr').append($('<th scope="col">').text(header));
  });

  for(let i = 0; i < 10; i++){
    var row = Story.instance.data.rawData[i];
    var tableRow = $('<tr>');
    Story.instance.data.headers.forEach(function(header, index){      
      tableRow.append($('<td>').text(row[header]));
    });
    dataTable.append(tableRow);;
  }


  $("#data-view")
    .append(
      $('<div>')
      .attr('id', 'data-table')
      .append(dataTable)
    );


  ///////////////////////////////////////////////////

  var overviewTable = $('<table>')
    .addClass('table table-striped')
    .append(
      $('<colgroup>')
        .append($('<col span="1" style="width: 20%;">'))
        .append($('<col span="1" style="width: 20%;">'))
        .append($('<col span="1" style="width: 30%;">'))
        .append($('<col span="1" style="width: 10%;">'))
        .append($('<col span="1" style="width: 10%;">'))
        .append($('<col span="1" style="width: 10%;">'))
    )
    .append(
      $('<thead>')
        .append(
          $('<tr>')
            .append($('<th scope="col">')
              .append(
                $('<div>')
                  .addClass('form-check')
                  .append($('<input class="form-check-input" type="checkbox" value="" id="field-of-interest-all">'))
                  .append($('<label class="form-check-label" for="field-of-interest-all">').text('Field'))
              )
            )
            .append($('<th scope="col">').text('Datatype'))
            .append($('<th scope="col">').text('Example Values'))
            .append($('<th scope="col">').text('Min.'))
            .append($('<th scope="col">').text('Max.'))
            .append($('<th scope="col">').text('Distribution'))
        )
    );

  var tableBody = $('<tbody>');
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

    var tableRow = $('<tr>');
    var tableCell = $('<td>');

    tableCell.append(
      $('<div>').addClass('form-check')
        .append($('<input class="form-check-input field-of-interest" type="checkbox" value="" data-field="'+header+'" id="field-of-interest-'+index+'">'))
        .append($('<label class="form-check-label" for="field-of-interest-'+index+'">').text(header))
    );

    tableRow.append(tableCell);
    tableCell = $('<td>');

    var detectedType = detectColumnType(header);
    convertDataType(header, detectedType);

    var typeSelect = $('<select>')
      .addClass('custom-select')
      .attr('id', 'field-type-'+header.replace(" ", "-"))
      .attr('onchange', 'convertDataType("'+header+'")')


    var types = {"string": "String", "float": "Float", "integer": "Integer", "datetime": "Date/Time"}
    Object.keys(types).forEach(function(type){

      var option = $('<option>')
        .attr('value', type)
        .text(types[type]);

      if(detectedType == type){
        option.attr('selected', '');
      }

      typeSelect.append(option)

    });

    tableCell.append(typeSelect);
    tableRow.append(tableCell);


    tableRow.append($('<td>').text(Story.instance.data.getExampleValues(header).sort().join(", ")));
    tableRow.append($('<td>').text(min));
    tableRow.append($('<td>').text(max));
    tableRow.append($('<td>').html(getSparkline(header)));

    overviewTable.append(tableRow);
  });

  
  $("#data-view")
  .append(
    $('<div>')
    .attr('id', 'overview-table')
    .append(overviewTable)
    .append($('<p>').text('Number of fields: '+Story.instance.data.headers.length))
    .append($('<p>').text('Number of rows: '+Story.instance.data.rawData.length))
    .toggle()
  );

  $("#data-view-spinner").hide();
  $("#data-view").show();

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

  if(typeof Story.instance.data.rawData[0][header] == "number"){

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

  assert(typeof Story.instance.data.rawData[0][header] == "number", "Can't get sparks for non-numeric column");

  var values = [];
  Story.instance.data.rawData.forEach(function(row, index){
    values.push(parseFloat(row[header]));
  });

  var histGenerator = d3.histogram()
    .domain([d3.min(values), d3.max(values)])
    .thresholds(10);

  return histGenerator(values);
}

//TODO: This currently only works if the data is held as a string
function detectColumnType(header){

  var types = {};

  Story.instance.data.rawData.forEach(function(row, index){

    type = detectType(row[header])

    if(!types[type]){
      types[type] = 1
    }
    else{
      types[type] += 1
    }

  });

  type = Object.keys(types).reduce((a, b) => types[a] > types[b] ? a : b);
  
  //return type.charAt(0).toUpperCase() + type.slice(1);
  return type;
}

function detectType(datum){
  
  if(!isNaN(datum)){
    if(datum.includes(".")){
      return "float";
    }
    else{
      return "integer";  
    }
  }
  else if (Date.parse(datum))
  {
    return "datetime";
  }
  else {
    return "string";
  }
}


function datasetSummary(){

  var datasetSummary = `
  <!--<p>Containing Errors: None</p>-->
  <p>Number of fields: `+Story.instance.data.headers.length+`</p>
  <p>Number of rows: `+Story.instance.data.rawData.length+`</p>`;

  $("#dataset-summary").html(datasetSummary);

}


function convertDataType(header, convertTo){

  if(convertTo == null){
    convertTo = $('#field-type-'+header.replace(" ", "-")).val();
  }

  for(var i = 0; i < Story.instance.data.rawData.length; i++){
    try{
      if(convertTo == "float"){
        Story.instance.data.parsedData[i][header] = parseFloat(Story.instance.data.rawData[i][header]);
      }
      else if(convertTo == "integer"){
        Story.instance.data.parsedData[i][header] = parseInt(Story.instance.data.rawData[i][header]);
      }
      else if(convertTo == "string"){
        Story.instance.data.parsedData[i][header] = Story.instance.data.rawData[i][header].toString();
      }
      else if(convertTo == "datetime"){
        Story.instance.data.parsedData[i][header] = new Date(Date.parse(Story.instance.data.rawData[i][header]));
      }
    }
    catch(error){
      console.error(error);
      Story.instance.data.parsedData[i][header] = Story.instance.data.rawData[i][header].toString();
      console.warn("Could not convert column '"+header+"' to type '"+convertTo+"'; converted instead to string")
    }
    
  }
}