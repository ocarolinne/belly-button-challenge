// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;
    console.log("Metadata:", metadata);

    // Filter the metadata for the object with the desired sample number
    let filtered = metadata.filter(sampleData => sampleData.id === parseInt(sample));
    console.log("Filtered sample result:", filtered);

    // Use d3 to select the panel with id of `#sample-metadata`
    let display = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    display.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    let meta_data_object = filtered[0];
    let keys = Object.keys(meta_data_object);

    keys.forEach(key => {
      let line_string = `${key.toUpperCase()}: ${meta_data_object[key]}`;
      display.append("h6").text(line_string);
    });

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;
    console.log("Samples:", samples);

    // Filter the samples for the object with the desired sample number
    let filtered = samples.filter(sampleData => sampleData.id == sample)[0];
    console.log("Filtered result:", filtered);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = filtered.otu_ids;
    console.log("otu_ids:", otu_ids);
    let sample_values = filtered.sample_values;
    console.log("sample_values:", sample_values);
    let otu_labels = filtered.otu_labels;
    console.log("otu_labels:", otu_labels);

    // Build a Bubble Chart
    let bubble_layout = {
      title: "Bacteria Culture Per Sample",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Number of Bacteria"
      }
    };

    let bubble_data = [{ 
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      type: 'scatter',
      mode: 'markers',
      marker:{
        size: sample_values,
        color: otu_ids,
        colorscale: "Viridis"
      }
    }];

    

    // Render the Bubble Chart  
    Plotly.newPlot("bubble", bubble_data, bubble_layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks


    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
   
    let bar_layout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {
        title: "Number of Bacteria"
      }
    };
    let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    let bar_data = [{
      y: yticks,
      x: sample_values.slice(0, 10).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h',
      transforms: [{
        type: 'sort',
        target: 'x',
        order: 'ascending'
      }]
    }];

        // Render the Bar Chart
    Plotly.newPlot("bar", bar_data, bar_layout);

  });
};

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let sample_name = data.names;
    console.log("Sample names:", sample_name);

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    sample_name.forEach(sample => {
      dropdown
        .append('option')
        .attr('value', sample)
        .attr('label', sample);
    });

    // Get the first sample from the list
    let first_sample = sample_name[0];
    console.log("First sample:", first_sample);


    // Build charts and metadata panel with the first sample
    buildCharts(first_sample);
    buildMetadata(first_sample);
  });
};

// Function for event listener
function optionChanged(newSample) {
  console.log(`Sample ${newSample} selected`);

  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
};

// Initialize the dashboard
init();
