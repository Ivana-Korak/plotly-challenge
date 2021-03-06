function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    d3.json("/metadata/" + sample).then(function(sample){
  // Use d3 to select the panel with id of `#sample-metadata`
      var select = d3.select("#sample-metadata");  
    // Use `.html("") to clear any existing metadata
      select.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
      Object.entries(data).forEach(([key,value]) =>{
        select
          .append('p').text(`${key} : ${value}`)
          .append('hr')
    });
  }) 
  }

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
d3.json("/samples/${sample}").then(function(data){

  // @TODO: Build a Bubble Chart using the sample data
  var xval = data.otu_ids;
  var yval = data.sample_values;
  var label = data.otu_labels;
  var size = data.sample_values;

  var bubbles = {
    x: xval,
    y: yval,
    label: label,
    mode: 'markers',
    marker: {
      size: size,
      color: xval
    }
  }
  var data = [bubbles];

  var layout = {
    title: "Bacteria Size",
  };
  Plotly.newPlot("bubble",data,layout);

// @TODO: Build a Pie Chart
// HINT: You will need to use slice() to grab the top 10 sample_values,
// otu_ids, and labels (10 each).

  var data = [{
    values: size.splice(0,10),
    labels: xval.splice(0,10),
    text: yval.splice(0,10),
  }]
  Plotly.newPlot('pie',data);
});
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
