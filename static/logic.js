// NEED:
//---------
// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});

// DON'T NEED? OR AT LEAST MINIMAL
// ---------------------------------
// Initialize all of the LayerGroups we'll be using
var layers = {
  COMING_SOON: new L.LayerGroup(),
  EMPTY: new L.LayerGroup(),
  LOW: new L.LayerGroup(),
  NORMAL: new L.LayerGroup(),
  OUT_OF_ORDER: new L.LayerGroup()
};

// NEED:
//-------
// Create the map with our layers
var map = L.map("map", {
  center: [41.161079, -104.805450],
  zoom: 4,
  /*  layers: [
     layers.COMING_SOON,
     layers.EMPTY,
     layers.LOW,
     layers.NORMAL,
     layers.OUT_OF_ORDER
   ] */
});



// NEED:
//------
// Add our 'lightmap' tile layer to the map
lightmap.addTo(map);

// DON'T NEED?
// ------------
// Create an overlays object to add to the layer control
var overlays = {
  "Coming Soon": layers.COMING_SOON,
  "Empty Stations": layers.EMPTY,
  "Low Stations": layers.LOW,
  "Healthy Stations": layers.NORMAL,
  "Out of Order": layers.OUT_OF_ORDER
};

// DON'T NEED?
//-------------
// Create a control for our layers, add our overlay layers to it
L.control.layers(null, overlays).addTo(map);

// NEED:
//-------
// Create a legend to display information about our map
var info = L.control({
  position: "bottomright"
});

// NEED LEGEND DIV
//=================
// When the layer control is added, insert a div with the class of "legend"
info.onAdd = function () {
  var div = L.DomUtil.create("div", "legend");
  return div;
};

// NEED:
//======
// Add the info legend to the map
info.addTo(map);

// ?? NEED ?? WHY ?? DON'T QUITE GET THIS:
// ---------------------------------------
// Initialize an object containing icons for each layer group
/* var icons = {
  COMING_SOON: L.ExtraMarkers.icon({
    icon: "ion-settings",
    iconColor: "white",
    markerColor: "yellow",
    shape: "star"
  }),
  EMPTY: L.ExtraMarkers.icon({
    icon: "ion-android-bicycle",
    iconColor: "white",
    markerColor: "red",
    shape: "circle"
  }),
  OUT_OF_ORDER: L.ExtraMarkers.icon({
    icon: "ion-minus-circled",
    iconColor: "white",
    markerColor: "blue-dark",
    shape: "penta"
  }),
  LOW: L.ExtraMarkers.icon({
    icon: "ion-android-bicycle",
    iconColor: "white",
    markerColor: "orange",
    shape: "circle"
  }),
  NORMAL: L.ExtraMarkers.icon({
    icon: "ion-android-bicycle",
    iconColor: "white",
    markerColor: "green",
    shape: "circle"
  })
}; */

// NEED: 
//======
// Perform an API call to the USGS endpoint
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function (earthquakeData) {
  var earthquakes = []
  earthquakeData.features.forEach(feature => {
    console.log(feature);
  });

  function determineColor(magnitude) {
    if (magnitude <= 1) { return "green" }
    else if (magnitude <= 1) { return "light green" }
    else if (magnitude <= 2 && magnitude > 1) { return "yellow" }
    else if (magnitude <= 3 && magnitude > 2) { return "light orange" }
    else if (magnitude <= 4 && magnitude > 3) { return "orange" }
    else { return "red" }
  }

  function onEachFeature(feature, layer) {
    layer.bindPopup(feature.properties.place);
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

  // DON'T THINK I NEED THIS ONE
  //-----------------------------
  // When the first API call is complete, perform another call to the Citi Bike Station Status endpoint
  /*  d3.json("https://gbfs.citibikenyc.com/gbfs/en/station_status.json", function(statusRes) {
     var updatedAt = infoRes.last_updated;
     var stationStatus = statusRes.data.stations;
     var stationInfo = infoRes.data.stations; */

  // Loop through the stations (they're the same size and have partially matching data)
  // for (var i = 0; i < stationInfo.length; i++) {

  // Create a new station object with properties of both station objects
  //   DONE ABOVE var station = Object.assign({}, stationInfo[i], stationStatus[i]);

  // If a station is listed but not installed, it's coming soon
  /* if (!station.is_installed) {
    stationStatusCode = "COMING_SOON"; */
  //}
  /*  // If a station has no bikes available, it's empty
   else if (!station.num_bikes_available) {
     stationStatusCode = "EMPTY";
   }
   // If a station is installed but isn't renting, it's out of order
   else if (station.is_installed && !station.is_renting) {
     stationStatusCode = "OUT_OF_ORDER";
   }
   // If a station has less than 5 bikes, it's status is low
   else if (station.num_bikes_available < 5) {
     stationStatusCode = "LOW";
   }
   // Otherwise the station is normal
   else {
     stationStatusCode = "NORMAL";
   } */

  // Update the station count
  //stationCount[stationStatusCode]++;
  // Create a new marker with the appropriate icon and coordinates
  /*   var newMarker = L.marker([station.lat, station.lon], {
      icon: icons[stationStatusCode]
    }); */

  // Add the new marker to the appropriate layer
  //newMarker.addTo(layers[stationStatusCode]);

  // Bind a popup to the marker that will  display on click. This will be rendered as HTML
  //newMarker.bindPopup(.name + "<br> Capacity: " + station.capacity + "<br>" + station.num_bikes_available + " Bikes Available");
  // }

  // Call the updateLegend function
  updateLegend();
});

// Update the legend's innerHTML with the last updated time and station count
function updateLegend(time, stationCount) {
  document.querySelector(".legend").innerHTML = [
    "<p>Updated: " + moment.unix(time).format("h:mm:ss A") + "</p>",
    "<p class='out-of-order'>Out of Order Stations: " + stationCount.OUT_OF_ORDER + "</p>",
    "<p class='coming-soon'>Stations Coming Soon: " + stationCount.COMING_SOON + "</p>",
    "<p class='empty'>Empty Stations: " + stationCount.EMPTY + "</p>",
    "<p class='low'>Low Stations: " + stationCount.LOW + "</p>",
    "<p class='healthy'>Healthy Stations: " + stationCount.NORMAL + "</p>"
  ].join("");
}

