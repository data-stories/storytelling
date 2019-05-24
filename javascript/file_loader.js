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
        <th scope="col">Column Sparkline</th>
        <th scope="col">Example Values</th>
      </tr>
    </thead>
    <tbody>`;

  HEADERS.forEach(function(header, index){

    valueDistribution += `
      <tr>
        <td>`+header+`</td>
        <td>Sparkline</td>
        <td>Example Values</td>
      </tr>`;

  });

  valueDistribution += ` 
    </tbody>
  </table>`;

  $("#value-distribution").html(valueDistribution);

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
        <option selected>Detected Type (`+detectColumnType()+`)</option>
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

function detectColumnType(){

  return "String";

}


function datasetSummary(){

  var datasetSummary = `
  <p>Containing Errors: None</p>
  <p>Number of fields: `+HEADERS.length+`</p>
  <p>Number of rows: `+DATAFILE.length+`</p>
  <p>Number of NA rows: `+""+`</p>`;

  $("#dataset-summary").html(datasetSummary);

}
