// the JS that creates the map here
// then stick it inside a <div> in the html

  // Set up initial map center and zoom level
  const map = L.map('map', {
    center: [42.22852721,13.85538983], // EDIT latitude, longitude to re-center map
    zoom: 5,  // EDIT from 1 to 18 -- decrease to zoom out, increase to zoom in
    scrollWheelZoom: true,
    tap: false
  });

  /* Control panel to display map layers */
  let controlLayers = L.control.layers( null, null, null, null, {
    position: "topright",
    collapsed: true
  }).addTo(map);


  /* Stamen colored terrain basemap tiles with labels */
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

  
  // see more basemap options at https://leaflet-extras.github.io/leaflet-providers/preview/

  // Read markers data from data.csv
  $.get('data/map_chart_19.csv', function(csvString) {

    // Use PapaParse to convert string to array of objects
    const data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

    // For each row in data, create a marker and add it to the map
    // For each row, columns `Latitude`, `Longitude`, and `Title` are required
    // here we need to make an exception and use VAR because we are incorporating older syntax with our papa.parse 
    for (var i in data) {
      var row = data[i];
      var imagePopup = row.filepath

 //     let popupContent = "<p>"+"Year: "+row.year+" Location: "+row.geolocation+"</p>" ;
let popupContent = "<p>"+"Year:  "+row.year+ "   Location:  "+row.geolocation+"</p>" ;
// original // let popupContent = "<p>"+"Year:  "+row.year+" Location:  "+row.geolocation+"<p> <img src='"+imagePopup+"' width='150px'> </p>"+"</p>" ;
      let marker = L.marker([row.Latitude, row.Longitude], {
        opacity: 0.9, 
          // Custom icon
        //icon: L.icon({
       // iconUrl:  'earthquake.jpg',
       // iconSize: [20, 40] })
      }).bindPopup(popupContent);

      marker.addTo(map);
    }

  });



