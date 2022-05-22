// map_19 JS creates the map here
// inside a <div> in the html

  // Set up initial map center and zoom level
  const map = L.map('map', {
    center: [42.22852721,13.85538983], // centering map
    zoom: 6.5,  // EDIT from 1 to 18 -- decrease to zoom out, increase to zoom in
    scrollWheelZoom: true,
    tap: false
  });

  /* Control panel to display map layers */
  let controlLayers = L.control.layers( null, null, null, null, {
    position: "topright",
    collapsed: true
  }).addTo(map);


  /* Stamen colored basemap Streets tiles with labels */
    const basemapStreets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 0,
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
    controlLayers.addBaseLayer(basemapStreets, 'OSM Map');
 
  const basemapStamenTerrain = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 19,
    ext: 'png'
}).addTo(map);
controlLayers.addBaseLayer(basemapStamenTerrain, 'Terrain Map');

  
  // library utilised: https://leaflet-extras.github.io/leaflet-providers/preview/

  // Read markers data from data.csv
  $.get('data/map_chart_19.csv', function(csvString) {

    // Use PapaParse to convert string to array of objects
    const data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

    // incorporating older syntax with papa.parse - reverting to var
    for (var i in data) {
      var row = data[i];
      var imagePopup = row.filepath

      let popupContent = "<p>"+"Year:  "+row.year+ "   Location:  "+row.geolocation+"</p>";
// original // let popupContent = "<p>"+"Year:  "+row.year+" Location:  "+row.geolocation+"<p> <img src='"+imagePopup+"' width='150px'> </p>"+"</p>" ;
      let marker = L.marker([row.Latitude, row.Longitude], {
        opacity: 0.8, 
// Customising icon
          icon: L.icon({
          iconUrl:  'icons/location.png',
          iconSize: [40, 40] })
      }).bindPopup(popupContent);

      marker.addTo(map);
    }

  });



