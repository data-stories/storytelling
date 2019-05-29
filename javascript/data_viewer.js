var reader = new FileReader();  

$("#file-upload").change(function(){
  var file = document.querySelector('input[type=file]').files[0];      
  reader.addEventListener("load", parseFile, false);
  if (file) {
    reader.readAsText(file);
  }

});


function parseFile(){
  DATAFILE = d3.csvParse(reader.result, function(d){
    return d;   
  });
  
  HEADERS = Object.keys(DATAFILE[0]);
  initView();
}

function initView(){
  dependencies();
  dataView();
}


function dependencies(){

}


function dataView(){

  var dataView = `
  <table class="table table-striped">
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
        <th scope="col">Max.</th>
        <th scope="col">Min.</th>
        <th scope="col">Distribution</th>
      </tr>
    </thead>
    <tbody>`;

  HEADERS.forEach(function(header, index){

    //TODO: There must be a more efficient way d3 can do this
    var values = [];
    DATAFILE.forEach(function(row){
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
            <input class="form-check-input field-of-interest" type="checkbox" value="" id="field-of-interest-`+index+`">
            <label class="form-check-label" for="field-of-interest-`+index+`">
              `+header+`
            </label>
          </div>
        </td>
        <td>
          <select class="custom-select" id="field-property-`+index+`">`;
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
        <td>`+max+`</td>
        <td>`+min+`</td>
        <td>`+getSparkline(header)+`</td>
      </tr>`;

  });

  dataView += ` 
    </tbody>
  </table>
  <!--<p>Containing Errors: None</p>-->
  <p>Number of fields: `+HEADERS.length+`</p>
  <p>Number of rows: `+DATAFILE.length+`</p>`;

  $("#data-view").html(dataView);


  $('.sparkline').sparkline('html', {type: 'bar', barColor: '#007bff', width: '50px'} );

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

}


function getSparkline(header){

  if(detectColumnType(header) == "Float" || detectColumnType(header) == "Integer"){

    var values = [];
    DATAFILE.forEach(function(row, index){
      values.push(parseFloat(row[header]));
    });

    var histGenerator = d3.histogram()
      .domain([d3.min(values), d3.max(values)])    // Set the domain to cover the entire intervall [0;]
      .thresholds(10);  // number of thresholds; this will create 19+1 bins

    var bins = histGenerator(values);
    
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


function getExampleValues(header, examples=4){

  var values = "";
  var maxExamples = (DATAFILE.length >= examples) ? examples : DATAFILE.length;
  var exampleIndexes = [];

  for(let i=0; i < maxExamples; i++){

    var index = Math.floor(Math.random() * DATAFILE.length);
    while(index in exampleIndexes){
      index = Math.floor(Math.random() * DATAFILE.length);
    }
    exampleIndexes.push(index);

    values += DATAFILE[index][header] + ", ";
  }

  return values.slice(0, -2);

}


function fieldProperties(){

  var fieldProperties = "<form>";

  HEADERS.forEach(function(header, index){

    fieldProperties += `
      <div class="form-group">
      <label class="form-check-label" for="field-property-`+index+`">
        `+header+`
      </label>
      <select class="custom-select" id="field-property-`+index+`">
        <option value="`+detectColumnType(header).toLowerCase()+`" selected>Detected Type (`+detectColumnType(header)+`)</option>
        <option value="string">String</option>
        <option value="number">Number</option>
        <option value="datetime">Date/Time</option>
      </select>
    </div>`;

  });

  fieldProperties += `
    <div class="form-group form-inline">
      <button class="btn btn-primary">Apply</button>&nbsp;&nbsp;
      <button class="btn btn-secondary">Revert</button>
    </div>
  </form>`;

  $("#field-properties").html(fieldProperties);

}

function detectColumnType(header){

  var types = {};

  DATAFILE.forEach(function(row, index){

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
  
  //TODO: Modify this to account for, e.g., datetimes

  if(parseFloat(datum) || parseInt(datum)){

    if(datum.includes(".")){
      return "Float";
    }
    else{
      return "Integer";  
    }
  }
  else{
    return "String";
  }
}


function datasetSummary(){

  var datasetSummary = `
  <!--<p>Containing Errors: None</p>-->
  <p>Number of fields: `+HEADERS.length+`</p>
  <p>Number of rows: `+DATAFILE.length+`</p>`;

  $("#dataset-summary").html(datasetSummary);

}


function validateData(){

  //TODO: Actually validate that sensible options have been chosen
  var dataIsValid = true;

  if(dataIsValid){
    $('#nav-story-template').find("a").removeClass("disabled");
    $('#nav-story').find("a").removeClass("disabled");
    switchView('story');
  }
  else{
    //TODO: explain to the user what has gone wrong
  }

}