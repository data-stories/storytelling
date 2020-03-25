// Metadata array to hold our annotations
// Used to regenerate the SVG annotations using d3-annotation
var allAnnotations = null;

/**
 * Populates and opens the edit chart modal dialogue
 * @param chartBlock - the chart-block DOM element that contains the chart SVG to be edited
 */
function openEditChartModal(chartBlock) {
  // Retrieve
  var chartAnns = chartBlock.attr('data-annotations');
  if(chartAnns) {
    allAnnotations = JSON.parse(chartAnns);
  } else {
    allAnnotations = [];
  }

  var chartCopy = $(chartBlock).clone();

  // Mark the original chart block (not the copy!) that we will replace
  // We must do this after we copy the chart, otherwise this attribute will
  // be copied to the edited chart and cause issues for future edited charts
  chartBlock.attr('data-edit-chart', true);

  // Clear and initialise the dialogue with our new chart
  $("#chart-to-edit")
    .empty()
    .append(chartCopy);

  clearEditAnnotationText();

  $("#edit-chart-modal").modal({
    resizable: false,
    escapeClose: false,
    clickClose: false,
    showClose: false
  });

  renderAllAnnotations(true);

  // Double-click to create a new annotation
  var svg = d3.select("#chart-to-edit > .chart-block > svg");
  svg.on("dblclick", function() {
    // Get the mouse click coords and title/label for our new annotation
    var coords = d3.mouse(this);
    var x = coords[0];
    var y = coords[1];
    var title = $("#edit-annotation-panel #annotation-title").val();
    var label = $("#edit-annotation-panel #annotation-label").val();

    // Create our new annotation, ensuring all others are deselected first
    deselectDBAnnotations();
    addChartAnnotation(title, label, x, y, 60, 60);

    // Now we've created it we re-render all annotations and populate the fields
    // for editing the title and label
    renderAllAnnotations(true);
    populateEditAnnotationText();
  });
}

/**
 * When the cancel button is clicked, perform clean-up since the dialogue is closing
 */
function cancelEditedChart() {
  // Ensure we remove the location mark from the original chart
  var origChart = $('.chart-block[data-edit-chart="true"')[0];
  $(origChart).removeAttr('data-edit-chart');

  // Ensure we clear the edit chart so it's not accidentally selected for something later
  $("#chart-to-edit").empty();
}

/**
 * When the save button is clicked, replace the original chart with the edited one and clean-up
 * as the dialogue is also being closed
 */
function saveEditedChart() {
  // Regenerate all chart annotations without edit mode enabled or any selected
  deselectDBAnnotations();
  renderAllAnnotations(false);

  // Find our 'marked' story chart-block and replace with a copy of our edited one
  var chart = $("#chart-to-edit").find('div').clone();
  chart.attr('data-annotations', JSON.stringify(allAnnotations));
  var origChart = $('.chart-block[data-edit-chart="true"')[0];
  $(origChart)
    .replaceWith(chart)
    .removeAttr('data-edit-chart');

  // Ensure we clear the edit chart so it's not accidentally selected for something later
  $("#chart-to-edit").empty();
}

// Functions for updating the edit annotation fields

function clearEditAnnotationText() {
  $("#edit-annotation-panel #annotation-title").val("");
  $("#edit-annotation-panel #annotation-label").val("");
}

function populateEditAnnotationText() {
  var selAnn = getSelectedDBAnnotation();
  if (selAnn) {
    $("#edit-annotation-panel #annotation-title").val(selAnn.note.title);
    $("#edit-annotation-panel #annotation-label").val(selAnn.note.label);
  }
}

/**
 * When update button clicked, update any selected annotation title and label, re-render all annotations
 */
function updateEditAnnotationText() {
  var selAnn = getSelectedDBAnnotation();
  if (selAnn) {
    selAnn.note.title = $("#edit-annotation-panel #annotation-title").val();
    selAnn.note.label = $("#edit-annotation-panel #annotation-label").val();
  }

  renderAllAnnotations(true);
}

/**
 * Add a new annotation to our annotation metadata array
 * @param {string} title - the annotation title, usually quite short
 * @param {string} label - the annotation label, explaining more detail
 * @param {int} x - x coordinate location of annotation to add to SVG
 * @param {int} y - y coordinate location of annotation to add to SVG
 * @param {int} dx - x axis offset relative to x coordinate for annotation note
 * @param {int} dy - y axis offset relative to y coordinate for annotation note
 */
function addChartAnnotation(title, label, x, y, dx, dy) {
  var annotation = {
    note: {
      title: title,
      label: label,
    },
    subject: {
      radius: 40,
      radiusPadding: 5
    },
    x: x,
    y: y,
    dy: dx,
    dx: dy,
    dragging: false,   // So we can track when an object is being dragged
    selected: true,    // For selecting annotations, true initially
    color: "#009900"   // Selected colour
  };
  allAnnotations.push(annotation);
}

// Annotation rendering functions

/**
 * Regenerate all annotations from our annotation metadata array
 * @param {boolean} editMode - if true, enable edit mode on annotations so they can be dragged
 */
function renderAllAnnotations(editMode) {
  var svg = d3.select("#chart-to-edit > .chart-block > svg");
  svg.select(".annotation-group").remove();

  var makeAnnotations = d3.annotation()
    .annotations(allAnnotations)
    .type(d3.annotationCalloutCircle)
    .editMode(editMode)
    .on("subjectclick connectorclick noteclick", function(ann) {
      selectDBAnnotation(ann);
      renderAllAnnotations(true);
      populateEditAnnotationText();
    })
    .on("dragstart", function(ann) {
      dragDBAnnotationStart(ann);
    })
    .on("dragend", function(ann) {
      dragDBAnnotationStop(ann);
    });

  svg.append("g")
    .attr("class", "annotation-group")
    .call(makeAnnotations);
}

/**
 * When delete button clicked, find currently selected annotation and delete it, re-render all annotations
 */
function deleteSelectedAnnotation() {
  var newAnnotationList = [];

  for(var a = 0; a < allAnnotations.length; a++){
    if (!allAnnotations[a].selected) {
      newAnnotationList.push(allAnnotations[a]);
    }
  }
  allAnnotations = newAnnotationList;

  renderAllAnnotations(true);
  clearEditAnnotationText();
}

// Lower-level chart annotation selection and dragging functions

/**
 * Locate annotation about to be dragged and mark is as being dragged
 * @param ann - the D3 annotation
 */
function dragDBAnnotationStart(ann) {
  var selAnn = locateDBAnnotation(ann.x, ann.y);
  if (selAnn) {
    selAnn.dragging = true;
  }
}

/**
 * Locate annotation for which dragging has stopped and update its properties
 * @param ann - the D3 annotation
 */
function dragDBAnnotationStop(ann) {
  var dragAnn = getDraggedDBAnnotation();
  if (dragAnn) {
    dragAnn.subject.radius = ann.subject.radius;
    dragAnn.subject.radiusPadding = ann.subject.radiusPadding;
    dragAnn.x = ann.x;
    dragAnn.y = ann.y;
    dragAnn.dx = ann.dx;
    dragAnn.dy = ann.dy;
    dragAnn.dragging = false;
  }
}

/**
 * Find and retrieve the annotation in the metadata array that is being dragged
 */
function getDraggedDBAnnotation() {
  for(var a = 0; a < allAnnotations.length; a++){
    if (allAnnotations[a].dragging) {
      return allAnnotations[a];
    }
  }

  return null;
}

/**
 * Locate an annotation in our metadata array that correlates with the given D3 annotation
 * and mark it as selected
 * @param ann - the D3 annotation which for we want to find its metadata array equivalent to select
 */
function selectDBAnnotation(ann) {
  deselectDBAnnotations();

  var selAnn = locateDBAnnotation(ann.x, ann.y);
  if (selAnn) {
    selAnn.selected = true;
    selAnn.color = "#009900";
  }
}

/**
 * Deselect all annotations, although there should only be one at any time
 */
function deselectDBAnnotations() {
  for(var a = 0; a < allAnnotations.length; a++){
    allAnnotations[a].selected = false;
    allAnnotations[a].color = "#E8336D";
  }
}

/**
 * Find and retrieve the currently selected annotation from the metadata array
 */
function getSelectedDBAnnotation() {
  for(var a = 0; a < allAnnotations.length; a++){
    if (allAnnotations[a].selected) {
      return allAnnotations[a];
    }
  }

  return null;
}

/**
 * Potentially locate an annotation in our metadata array at the given coordinates
 */
function locateDBAnnotation(x, y) {
  for(var a = 0; a < allAnnotations.length; a++){
    if((allAnnotations[a].x === x) && (allAnnotations[a].y === y)) {
      return allAnnotations[a];
    }
  }

  return null;
}