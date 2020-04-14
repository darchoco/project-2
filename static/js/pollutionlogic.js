
// Wrap every letter in a span for anime library
var textWrapper = document.querySelector('.ml3');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline({loop: false})
  .add({
    targets: '.ml3 .letter',
    opacity: [0,1],
    easing: "easeInOutQuad",
    duration: 2250,
    delay: (el, i) => 150 * (i+1)
  })


//declare city url for pulling list of available cities for Arizona
var city_url = `http://api.airvisual.com/v2/cities?state=Arizona&country=USA&key=${YOUR_API_KEY}`;
//set blank array to have city data pushed
var cities = []

//set function for intial pull of api data
function getdata()
{
  //sets up json read
d3.json(city_url).then(function(data)
{
  city_data = data["data"]
  //pulls the city name from the dictionary, listed in array of dictionaries at city
  city_data.forEach(city=>cities.push(city.city)); 
  //dyanmically obtains the dropdown data from the json pull and inserts it into the dropdown
 var dropdown = d3.select("#selDataset").selectAll("select");
    dropdown.data(cities)
    .enter()
    .append("option")
    .html(function(d)
    {
      return `<option value = "${d}">${d}</option>`
    });
    //finds first city in the dropdown
    var currentCity = d3.select("#selDataset").node().value
    //pulls function to display the data
    optionChanged(currentCity)
  });

};

//declare function for input option changes
function optionChanged(input)
{
  //set url to be dynamic based on dropdown choice
  var url = `http://api.airvisual.com/v2/city?city=${input}&state=Arizona&country=USA&key=${YOUR_API_KEY}`;
  //call api
d3.json(url).then(function(data)
{
  //breakdown data pull for manipulation as needed
  var location_data = data["data"]
  var current_data = location_data["current"]
  var pollution_data = current_data["pollution"]
  //sets aqi variable for displaying
  var aqi= pollution_data.aqius
//set trace to display gauge with plotly
  var trace =
  {
    
      domain: { x: [0, 1], y: [0, 1] },
      value: aqi,
      //dynamic title based on what was pulled
      title: { text: `AQI for: ${location_data.city}`},
      type: "indicator",
      mode: "gauge+number",
      gauge:
      {
        axis: { range:[null,500]},
        'bar':{'color':'black', 'line': {'color':'gray'}}, 
        'bgcolor':"black",
        //colors set based on official epa coloring scale at https://www3.epa.gov/aircompare/#basic
        steps: [
          {'range': [0,50],'color':'#00e400'},
          {'range': [51,100],'color':'#ffff00'},
          {'range': [101,150],'color':'#ff7e00'},
          {'range': [151,200],'color':'#ff0000'},
          {'range': [201,300],'color':'#8f3f97'},
          {'range': [301,500],'color':'#7e0023'}
       ]
      }
    
  }
  //sets to array for Plotly to ingest
  var data = [trace]

  // Plot the charts to the divs gauge
  Plotly.newPlot("gauge",data);


})
};
getdata()