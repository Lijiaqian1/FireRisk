var dataset = ee.ImageCollection('MODIS/061/MOD11A2')
                  .filterDate('2022-05-01', '2022-05-02'); 
var landSurfaceTemperature = dataset.select('LST_Day_1km').first(); 

var landSurfaceTemperatureVis = {
  min: 14000.0,
  max: 16000.0,
  palette: [
    '040274', '040281', '0502a3', '0502b8', '0502ce', '0502e6',
    '0602ff', '235cb1', '307ef3', '269db1', '30c8e2', '32d3ef',
    '3be285', '3ff38f', '86e26f', '3ae237', 'b5e22e', 'd6e21f',
    'fff705', 'ffd611', 'ffb613', 'ff8b13', 'ff6e08', 'ff500d',
    'ff0000', 'de0101', 'c21301', 'a71001', '911003'
  ],
};
 

var france = countries.filter(ee.Filter.eq('ADM0_NAME', 'Italy'));


var geometry = france.geometry();

Map.setCenter(6.746, 46.529, 2);
Map.addLayer(
    landSurfaceTemperature, landSurfaceTemperatureVis,
    'Land Surface Temperature');
var landSurfaceTemperatureVisImg = landSurfaceTemperature.visualize(landSurfaceTemperatureVis);
Export.image.toDrive({
  image: landSurfaceTemperatureVisImg,
  description: 'temperature_map',
  folder: 'GEE_exports',
  region: geometry, 
  scale: 1000,
  crs: 'EPSG:4326', 
  maxPixels: 1e13

});

