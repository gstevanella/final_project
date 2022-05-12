
  // then stick it inside a <div> in the html

  // Set up initial map center and zoom level
  const map2 = L.map('map2', {
    center: [42.22852721,13.85538983], // EDIT latitude, longitude to re-center map
    zoom: 6.5,  // EDIT from 1 to 18 -- decrease to zoom out, increase to zoom in
    scrollWheelZoom: true,
    tap: false
  });

  /* Control panel to display map layers */
  let controlLayers2 = L.control.layers( null, null, null, null, {
    position: "topright",
    collapsed: true
  }).addTo(map2);


  /* Stamen colored terrain basemap tiles with labels */
  
  const basemapStamenTerrain2 = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 19,
    ext: 'jpg'
}).addTo(map2);
controlLayers2.addBaseLayer(basemapStamenTerrain, 'Terrain Map');

const basemapStreets2 = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  minZoom: 0,
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
  controlLayers2.addBaseLayer(basemapStreets, 'OSM Map');


  
  // see more basemap options at https://leaflet-extras.github.io/leaflet-providers/preview/

  // Read markers data from data.csv
  $.get('data/map_chart_20.csv', function(csvString) {

    // Use PapaParse to convert string to array of objects
    const data2 = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

    // For each row in data, create a marker and add it to the map
    // For each row, columns `Latitude`, `Longitude`, and `Title` are required
    // here we need to make an exception and use VAR because we are incorporating older syntax with our papa.parse 
    for (var i in data2) {
      var row = data2[i];
      var imagePopup = row.filepath

 //     let popupContent = "<p>"+"Year: "+row.year+" Location: "+row.geolocation+"</p>" ;
let popupContent2 = "<p>"+"Year:  "+row.year+ "   Location:  "+row.geolocation+"</p>" ;
// original // let popupContent = "<p>"+"Year:  "+row.year+" Location:  "+row.geolocation+"<p> <img src='"+imagePopup+"' width='150px'> </p>"+"</p>" ;
      let marker2 = L.marker([row.Latitude, row.Longitude], {
        opacity: 0.9, 
          // Custom icon
          icon: L.icon({
            iconUrl:  'icons/location.png',
            iconSize: [40, 40] })
      }).bindPopup(popupContent2);

      marker2.addTo(map2);
    }

  });



