var dataset = ee.ImageCollection('MODIS/061/MYD14A2')
                  .filterDate('2017-08-29', '2017-08-30'); 
var fireMask = dataset.select('FireMask').first();

var fireMaskVis = {
  min: 3.0,
  max: 8.0,
  palette: ['blue','green','red'] 
};
var countries = ee.FeatureCollection('FAO/GAUL/2015/level0'); 
var italy = countries.filter(ee.Filter.eq('ADM0_NAME', 'Italy')); 

var geometry = italy.geometry(); 

Map.setCenter(12.5674, 41.8719, 6); 
Map.addLayer(
    fireMask, fireMaskVis,
    'Fire Mask'); 

var fireMaskVisImg = fireMask.visualize(fireMaskVis); 
Export.image.toDrive({
  image: fireMaskVisImg,
  description: 'fire_mask_map',
  folder: 'GEE_exports',
  region: geometry, 
  scale: 1000, 
  crs: 'EPSG:4326', 
  maxPixels: 1e13 
});
