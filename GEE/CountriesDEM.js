// Import the dataset and select the elevation band.
var dataset = ee.Image('NASA/NASADEM_HGT/001');
var elevation = dataset.select('elevation');

// Add a white background image to the map.
var background = ee.Image(1);
Map.addLayer(background, {min: 0, max: 1});

// Set elevation visualization properties.
var elevationVis = {
  min: 0,
  max: 2000,
  palette: ['006633', 'E5FFCC', '662A00', 'D8D8D8', 'F5F5F5'],
};

// Set elevation <= 0 as transparent and add to the map.
Map.addLayer(elevation.updateMask(elevation.gt(0)), elevationVis, 'Elevation');
Map.setCenter(17.93, 7.71, 2);
var countries = ee.FeatureCollection('FAO/GAUL/2015/level0'); 
var france = countries.filter(ee.Filter.eq('ADM0_NAME', 'Italy'));

var geometry = france.geometry();
var geometry = ee.Geometry.Rectangle([92, 9, 110, 23]);
// Export the elevation image to Google Drive
Export.image.toDrive({
  image: elevation.updateMask(elevation.gt(0)),
  description: 'elevation_map',
  folder: 'GEE_exports',
  region: geometry,
  scale: 1000,
  crs: 'EPSG:4326',
  maxPixels: 1e13
});
