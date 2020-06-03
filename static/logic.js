// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});

// Create the map with our layers
var map = L.map("map", {
  center: [41.161079, -104.805450],
  zoom: 4,
});

// Add our 'lightmap' tile layer to the map
lightmap.addTo(map);

// Create a legend to display information about our map
var info = L.control({
  position: "bottomright"
});

// When the layer control is added, insert a div with the class of "legend"
info.onAdd = function () {
  var div = L.DomUtil.create("div", "legend");
  return div;
};

// Add the info legend to the map
info.addTo(map);

// Perform an API call to the USGS endpoint
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function (earthquakeData) {


  function determineColor(magnitude) {
    if (magnitude < 1) { return "#009900" }
    else if (magnitude >= 1 && magnitude < 2) { return "#00ff00" }
    else if (magnitude >= 2 && magnitude < 3) { return "yellow" }
    else if (magnitude >= 3 && magnitude < 4) { return "#ffd161" }
    else if (magnitude >= 4 && magnitude < 5) { return "f2a512" }
    else { return "red" }
  }

  function onEachFeature(feature, layer) {
    var popupData = "Place: " + feature. properties.place + "<br>" + "Magnitude: " + feature.properties.mag;
    layer.bindPopup(popupData);
  }

  L.geoJSON(earthquakeData.features, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: feature.properties.mag * 3,
        fillColor: determineColor(feature.properties.mag),
        color: determineColor(feature.properties.mag),
        opacity: 1,
        fillOpacity: 1
      });
    },
    onEachFeature: onEachFeature
  }).addTo(map);

  // Call the updateLegend function
  updateLegend();
});

// Update the legend
function updateLegend(time, stationCount) {
  document.querySelector(".legend").innerHTML = [
    "<span style='background: #009000'>&nbsp;&nbsp;</span>&nbsp;0 - 1",
    "<span style='background: #00ff00'>&nbsp;&nbsp;</span>&nbsp;1 - 2",
    "<span style='background: yellow'>&nbsp;&nbsp;</span>&nbsp;2 - 3",
    "<span style='background: #ffd161'>&nbsp;&nbsp;</span>&nbsp;3 - 4",
    "<span style='background: #f2a512'>&nbsp;&nbsp;</span>&nbsp;4 - 5",
    "<span style='background: red'>&nbsp;&nbsp;</span>&nbsp;5+"
  ].join("<br>");
}

