
// Wrap every letter in a span
var textWrapper = document.querySelector('.ml3');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline({loop: false})
  .add({
    targets: '.ml3 .letter',
    opacity: [0,1],
    easing: "easeInOutQuad",
    duration: 1000,
    delay: (el, i) => 100 * (i+1)
  });

//call api ID data for dynamically creating call. set up keys that are viewable, and then the actual call data for the values
  var dropdown_list = Object.keys(eia_api_id);
  //set dropdown data for the line graph, append each value
  var dropdown = d3.select("#selDataset").selectAll("select");
  dropdown.data(dropdown_list)
  .enter()
  .append("option")
  .html(function(d)
  {
    return `<option value = "${d}">${d}</option>`
  });
  //finds first gas type in the dropdown
  var currentGas = d3.select("#selDataset").node().value
  //pulls function to display the data
  optionChanged(currentGas)

  //call list of available data ids to cycle through for API
  function optionChanged (input)
  {
//set up api call using api_id dictionary, and the input from the dropdown to find the key value
  var gas_url = `http://api.eia.gov/series/?api_key=${eia_api_key}&series_id=${eia_api_id[input]}`

  //call json string to pull data
  d3.json(gas_url).then(function(data)
  {
    //declare variables that will be used in line graph creation
    var graph_name_list = []
    var graph_data_list = []
    
    //declare variable that pulls only the last 15 months of data
    var last_15 =data.series[0].data.slice(0,15);
    //sort data to have oldest first
    last_15.sort();

    //loop data to push to specific arrays for graphing
    for (i=0; i <last_15.length; i++)
    {
      graph_data_list.push(last_15[i][1]);
      graph_name_list.push(last_15[i][0]);
    };

    //set up plotly data
    var trace =
    {
      //set to 15 due to have 15 sets of data every time due to slice
      x:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
      y:graph_data_list,
      mode: 'lines'
    };
    var data = [trace];

var layout =
{

  title: "gas prices over time",
  //replacing numbers with actual date values
  xaxis: {
    tickmode: "array", 
    tickvals: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
    //shifting string to have month number first, separate by "/" for better view
    ticktext: graph_name_list.map(date=>(date.substring(4,7)+"/"+date.substring(0,4)))
  }
};

//call Plotly to plot the graph at 'myDiv'
Plotly.newPlot('myDiv', data, layout);

    
  })};

