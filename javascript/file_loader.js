var reader = new FileReader();  

$("#file-upload").change(function(){
  var file = document.querySelector('input[type=file]').files[0];      
  reader.addEventListener("load", parseFile, false);
  if (file) {
    reader.readAsText(file);
  }

});


function parseFile(){
  DATAFILE = d3.csv.parse(reader.result, function(d){
    return d;   
  });
  
  HEADERS = Object.keys(DATAFILE[0]);
  initView();
}

function initView(){
  fieldsOfInterest();
  dependency();
  valueDistribution();
  fieldProperties();
  datasetSummary();
}


function fieldsOfInterest(){
  var fieldsOfInterest = `
  <form>
    <div class="form-group">`;

  HEADERS.forEach(function(header, index){

    fieldsOfInterest += `
      <div class="form-check">
        <input class="form-check-input" type="checkbox" value="" id="field-of-interest-`+index+`">
        <label class="form-check-label" for="field-of-interest-`+index+`">
          `+header+`
        </label>
      </div>`;

  });
  
  fieldsOfInterest += `
    </div>
  </form>`;

  $("#fields-of-interest").html(fieldsOfInterest);
}


function dependency(){

}


function valueDistribution(){

  var valueDistribution = `
  <table class="table table-striped">
    <thead>
      <tr>
        <th scope="col">Field Name</th>
        <th scope="col">Example Values</th>
        <th scope="col">Max.</th>
        <th scope="col">Min.</th>
        <th scope="col">Sparkline</th>
      </tr>
    </thead>
    <tbody>`;

  HEADERS.forEach(function(header, index){

    minMax = getMinMax(header)
    min = minMax[0];
    max = minMax[1];

    valueDistribution += `
      <tr>
        <td>`+header+`</td>
        <td>`+getExampleValues(header)+`</td>
        <td>`+max+`</td>
        <td>`+min+`</td>
        <td>`+getSparkline(header)+`</td>
      </tr>`;

  });

  valueDistribution += ` 
    </tbody>
  </table>`;

  $("#value-distribution").html(valueDistribution);

}

function getMinMax(header){

  if(detectColumnType(header) != "Number"){
    return ["n/a", "n/a"]
  }
  else{

    var min = Infinity;
    var max = -Infinity;

    DATAFILE.forEach(function(row, index){

      min = (row[header] < min) ? row[header] : min;
      max = (row[header] > max) ? row[header] : max;

    });

    return [min, max];
  }

}

function getSparkline(header){

  if(detectColumnType(header) != "Number"){
    return "n/a";
  }
  else{
    return "v-^---^--v--";
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
    return "Number";
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
