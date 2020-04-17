//Selecting our json file to use and printing to the console
d3.json("static/unemploymentData.json").then(function(data) {
    
    // Selecting our json file to use and printing to the console
    // Nested loop for the state coordinates and the unemployment rate per state
    // function stateRate() {d3.json("unemploymentData.json").then(function(data) {
    // rate = []
    
    
    
        // Promise Pending
    // const dataPromise = d3.json("unemploymentData.json");
    // console.log("Data Promise: ", dataPromise);
    
    
    // Creating a map with an outline and adding other feautures
    
    var map = L.map('map').setView([37.8, -96], 4);
    
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox/light-v9",
        accessToken: API_KEY
      }).addTo(map);
    
    
      L.geoJson(statesData).addTo(map);

    
    
    // Styling function for our GeoJson later so the fill color depends on it's feature 
    function style(feature) {
        return {
            fillColor: getColor(feature.properties.name),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }
    
   
    
    
          // control that shows state info on hover
          var info = L.control();

          info.onAdd = function(map) {
            this._div = L.DomUtil.create("div", "info");
            this.update();
            return this._div;
          };
      
          info.update = function(state) {
            Object.entries(data.UnemploymentRate).forEach(([key, value]) => {
                if (key == state)
                d = value
                currentstate = state
                {
            this._div.innerHTML =
              "<h4>Unemployment rate</h4>" +
              (state
                ? '<b>' + d + '%</b><br />'
                : "Hover over a state");
              }
          })};
      
          info.addTo(map);
      
          function getColor(state) { 
            d=0
                Object.entries(data.UnemploymentRate).forEach(([key, value]) => {
                    if (key == state) {d=value;
                    // break;
                    }
                });
           
                        return d > 8.8  ? '#800026' :
                            d > 5.2  ? '#BD0026' :
                            d > 4.5  ? '#E31A1C' :
                            d > 3.8  ? '#FC4E2A' :
                            d > 3.5   ? '#FD8D3C' :
                            d > 3.1   ? '#FEB24C' :
                            d > 2.6   ? '#FED976' :
                                       '#FFEDA0';
        }
        function getLegendColor(d) { 

           
                        return d > 8.8  ? '#800026' :
                            d > 5.2  ? '#BD0026' :
                            d > 4.5  ? '#E31A1C' :
                            d > 3.8  ? '#FC4E2A' :
                            d > 3.5   ? '#FD8D3C' :
                            d > 3.1   ? '#FEB24C' :
                            d > 2.6   ? '#FED976' :
                                       '#FFEDA0';
        }
        
        
        // Styling function for our GeoJson later so the fill color depends on it's feature 
        function style(feature) {
            return {
                fillColor: getColor(feature.properties.name),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        }
      
          function highlightFeature(e) {
            var layer = e.target;
      
            layer.setStyle({
              weight: 5,
              color: "#666",
              dashArray: "",
              fillOpacity: 0.7
            });
      
            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
              layer.bringToFront();
            }
      
            info.update(layer.feature.properties);
          }
      
          var geojson;
      
          function resetHighlight(e) {
            geojson.resetStyle(e.target);
            info.update();
          }
      
          function zoomToFeature(e) {
            map.fitBounds(e.target.getBounds());
          }
      
          function onEachFeature(feature, layer) {
            layer.on({
              mouseover: highlightFeature,
              mouseout: resetHighlight,
              click: zoomToFeature
            });
          }
      
          geojson = L.geoJson(statesData, {
            style: style,
            onEachFeature: onEachFeature
          }).addTo(map);
       
          map.attributionControl.addAttribution(
            'Unemployment Data &copy; <a href="https://data.bls.gov/lausmap/showMap.jsp;jsessionid=F2F0F0E2E77AF22964728BF782648362._t3_07v">US Bureau of Labor Statistics</a>'
          );
      
          var legend = L.control({ position: "bottomright" });
      
          legend.onAdd = function(map) {
            var div = L.DomUtil.create("div", "info legend"),
              grades = [0,2.6 , 3.1 , 3.5, 3.8, 4.5 , 5.2 , 8.8],
              labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getLegendColor(grades[i] + .1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
      
            
            return div;
          };
      
          legend.addTo(map);
       
       });
