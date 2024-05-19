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
var start = ee.Date('2022-11-1');
var end = ee.Date('2022-11-9');
var numDays = 61;
var geometry = ee.Geometry.Rectangle([92, 9, 110, 23]);

var cloudMaskLST = function(image) {
  var QA = image.select('QC_Day');
  var mask = QA.bitwiseAnd(1 << 1).eq(0);  // Use cloud state information
  return image.updateMask(mask);
};
for (var i = 0; i < numDays; i++){
  var iniDate = start.advance(i, 'day');
  var endDate = end.advance(i, 'day');
  /*var dataset = ee.ImageCollection('MODIS/061/MOD11A2')
                    .filterDate(iniDate, endDate); */
  var dataset = ee.ImageCollection('MODIS/061/MOD11A2')
                  .filterDate(iniDate, endDate)
                  .map(cloudMaskLST); 
  var landSurfaceTemperature = dataset.select('LST_Day_1km').first(); 
  var landSurfaceTemperatureVisImg = landSurfaceTemperature.visualize(landSurfaceTemperatureVis);
  var folderName = 'temp_2022';
  var dateString = iniDate.format('YYYY_MM_dd').getInfo();
  var description = 'temp_2022_' + dateString;
  var fileNamePrefix = dateString.concat('_temp');
  
  
  Export.image.toDrive({
    image: landSurfaceTemperatureVisImg,
    description: description,
    folder: folderName,
    fileNamePrefix: fileNamePrefix,
    region: geometry, 
    scale: 1000,
    crs: 'EPSG:4326', 
    maxPixels: 1e13
  
  });
}
