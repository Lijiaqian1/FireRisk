
var dataset = ee.ImageCollection('TRMM/3B42')
                  .filter(ee.Filter.date('2019-07-01', '2019-07-02')); 


var precipitation = dataset.select(['HQprecipitation']).first();


var precipitationVis = {
  min: 0.1,
  max: 1.2,
  palette: ['blue', 'purple', 'cyan', 'green', 'yellow', 'red'],
};
var countries = ee.FeatureCollection('FAO/GAUL/2015/level0'); 
var italy = countries.filter(ee.Filter.eq('ADM0_NAME', 'Thailand')); 

var geometry = ee.Geometry.Rectangle([92, 9, 110, 23]); 


Map.setCenter(-79.98, 23.32, 4);

Map.addLayer(precipitation, precipitationVis, 'Precipitation');
var precipitationVisImg = precipitation.visualize(precipitationVis);
Export.image.toDrive({
  image: precipitationVisImg,
  description: 'precipitation_map',
  folder: 'GEE_exports',
  region: geometry,
  scale: 10000,
  crs: 'EPSG:4326',
  maxPixels: 1e13
});

