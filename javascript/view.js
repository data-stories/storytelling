var DATA_INSPECTOR_VIEW=`
<div class="row">

        <input type="file" class="form-control-file" id="file-upload" accept=".csv" style="display:none">

        <a class="btn btn-primary file-button" href="#" onClick="$('#file-upload').click(); return;" role="button"><i class="fas fa-file-upload"></i>&nbsp;Upload</a>

        <a class="btn btn-secondary file-button" href="#" role="button"><i class="fas fa-save"></i>&nbsp;Save</a>

        <a class="btn btn-secondary file-button" href="#" role="button"><i class="fas fa-copy"></i>&nbsp;Load</a> 
    </div>

    <br/>

    <div class="row" style="height: 600px;">

      <!-- LEFT COLUMN -->
      <div class="col-3 h-100">
        <div class="row h-50">
          <div class="col h-100">
            <div class="card h-100">
              <h6 class="card-header">Fields of Interest</h6>
              <div class="card-body scroll text-centre" id="fields-of-interest">
                
              </div>
            </div>
          </div>
        </div>
        <div class="row h-50">
          <div class="col h-100">
            <div class="card h-100">
              <h6 class="card-header">Dependency</h6>
              <div class="card-body scroll text-centre">
                <form>
                  <div class="form-group">
                    <label class="form-check-label" for="independent-dropdown">
                      Independent
                    </label>
                    <select class="custom-select" id="independent-dropdown">
                      <option selected>Choose a field</option>
                      <option value="1">One</option>
                      <option value="2">Two</option>
                      <option value="3">Three</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-check-label" for="dependent-dropdown">
                      Dependent
                    </label>
                    <select class="custom-select" id="dependent-dropdown">
                      <option selected>Choose a field</option>
                      <option value="1">One</option>
                      <option value="2">Two</option>
                      <option value="3">Three</option>
                    </select>
                  </div>
                  <div class="form-group form-inline">
                    <button class="btn btn-primary">Apply</button>&nbsp;&nbsp;
                    <button class="btn btn-secondary">Revert</button>
                  </div>
                </form>

              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CENTRE COLUMN -->
      <div class="col-6 h-100">
        <div class="card h-100">
          <h6 class="card-header">Value Distribution</h6>
              <div class="card-body scroll text-centre" id="value-distribution">
              <p>To begin, upload a .CSV file</p>
              <a class="btn btn-lg btn-primary file-button" href="#" onClick="$('#file-upload').click(); return;" role="button"><i class="fas fa-file-upload"></i>&nbsp;Upload</a>
              </div>
        </div>
      </div>

      <!-- RIGHT COLUMN -->
      <div class="col-3 h-100">
        <div class="row h-50">
          <div class="col h-100">
            <div class="card h-100">
              <h6 class="card-header">Field Properties</h6>
              <div class="card-body scroll text-centre" id="field-properties">
                
              </div>
            </div>
          </div>
        </div>
        <div class="row h-50">
          <div class="col h-100">
            <div class="card h-100">
              <h6 class="card-header">Dataset Summary</h6>
              <div class="card-body scroll text-centre" id="dataset-summary">
                
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <br/>
    <br/>

    <div class="row" align="center">
        <a class="btn btn-lg btn-primary" href="#" role="button" onClick="switchView(\'story\')">Create Story</a>
    </div>    
`

var STORY_VIEWER_VIEW = `
<div class="row">

        <a class="btn btn-primary file-button" href="#" role="button"><i class="fas fa-file"></i>&nbsp;New</a>

        <a class="btn btn-secondary file-button" href="#" role="button"><i class="fas fa-folder-open"></i>&nbsp;Load</a> 

        <a class="btn btn-secondary file-button" href="#" role="button"><i class="fas fa-save"></i>&nbsp;Save</a>

        <a class="btn btn-secondary file-button" href="#" role="button"><i class="fas fa-file-upload"></i>&nbsp;Export</a> 
    </div>

    <br/>

    <div class="row" style="height: 600px;">

      <div class="col-9 h-100">
        <div class="card h-100">
          <h6 class="card-header">Story Sections</h6>
          <div class="card-body scroll text-centre">
            <form>
                <div class="form-group">
                  <textarea rows="4" cols="100">
                  Here is the story template 
                  </textarea>
                </div>
            </form>
          </div>
        </div>
      </div>

      <div class="col-3">

      <div class="row h-50">
        <div class="col h-100">
          <div class="card h-100">
            <h6 class="card-header">Visualisation Recommendations</h6>
            <div class="card-body scroll text-centre">
              <p>Recommended Chart</p>
              <p>Recommended Chart</p>
              <p>Recommended Chart</p>
              <p>Recommended Chart</p>
              <p>Recommended Chart</p>
              <p>Recommended Chart</p>
            </div>
          </div>
        </div>
      </div>
      <div class="row h-50">
        <div class="col h-100">
          <div class="card h-100">
            <h6 class="card-header">Annotation Toolkit</h6>
            <div class="card-body scroll text-centre">
              <p><i class="fas fa-mouse-pointer"></i>Select</p>
              <p><i class="fas fa-font"></i>Text Box</p>
              <p><i class="fas fa-grip-lines"></i>Line</p>
              <p><i class="fas fa-vector-square"></i>Rectangle</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>

    <br/>

    <div class="row">
      <div class="col-9" align="center">
        <a class="btn btn-secondary file-button" href="#" role="button"><i class="fas fa-step-backward"></i>&nbsp;First</a>
        <a class="btn btn-secondary file-button" href="#" role="button"><i class="fas fa-chevron-left"></i></i>&nbsp;Previous</a> 
        <a class="btn btn-secondary file-button" href="#" role="button"><i class="fas fa-plus"></i>&nbsp;New</a>
        <a class="btn btn-secondary file-button" href="#" role="button">Next&nbsp;<i class="fas fa-chevron-right"></i></a>
        <a class="btn btn-secondary file-button" href="#" role="button">Last&nbsp;<i class="fas fa-step-forward"></i></a>
      </div>

      <div class="col">
        <div class="card">
            <h6 class="card-header">Section Information</h6>
            <div class="card-body scroll text-centre">
              <p>Section Type:</p>
              <p>Recommended Decision:</p>
            </div>
          </div>
      </div>
    </div>

    <div class="row" align="center">
        <a class="btn btn-secondary" href="#" role="button" onClick="switchView(\'data\')">Back to Data</a>
    </div>
`

var FOOTER = `
<br/>
    <br/>
    <br/>

    <section id="footer">
      </hr>
      <div class="row">
        <div class="col-xs-1 col-sm-1 col-md-1 mt-2 mt-sm-2 text-center">
          <a href="http://datastories.co.uk"><img src="static/images/logos/datastories-small.png" alt="Data Stories"></a>
        </div>
        <div class="col-xs-10 col-sm-10 col-md-10 mt-2 mt-sm-2 text-center">
          <p>The Data Storytelling Tool was created as part of</p>
          <p><a href="http://datastories.co.uk/">Data Stories</a> (<a href="https://www.epsrc.ac.uk/">EPSRC</a> Project No. <a href="http://gow.epsrc.ac.uk/NGBOViewGrant.aspx?GrantRef=EP/P025676/1">EP/P025676/1</a>) and <a href="https://theybuyforyou.eu/">They Buy For You</a> (<a href="https://ec.europa.eu/programmes/horizon2020/">EU Horizon 2020</a> research project No. <a href="https://cordis.europa.eu/project/rcn/213115_en.html">780247</a>)</p>
          <p class="h6">&copy All right Reversed.<a class="text-green ml-2" href="https://www.soton.ac.uk" target="_blank">University of Southampton</a></p>
        </div>
        <div class="col-xs-1 col-sm-1 col-md-1 mt-2 mt-sm-2 text-center">
          <a href="http://theybuyforyou.eu"><img src="static/images/logos/tbfy-small.png" alt="They Buy For You"></a>
        </div>
      </div>  
  </section>
`

var VIEWS = {"data": DATA_INSPECTOR_VIEW, "story": STORY_VIEWER_VIEW};

function switchView(view){
    if(view in VIEWS){
        $("main").html(VIEWS[view]+FOOTER);

        if(view == "data" && DATAFILE){
          initView();
        }
    }
    else{
       console.error("Unrecognised page view: '"+view+"'");
    }
}

switchView("data")