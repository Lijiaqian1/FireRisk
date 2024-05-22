var precipitationVis = {
  min: 0.1,
  max: 1.2,
  palette: ['blue', 'purple', 'cyan', 'green', 'yellow', 'red'],
};
var geometry = ee.Geometry.Rectangle([92, 9, 110, 23]);

var start = ee.Date('2022-01-01');
var end = ee.Date('2022-01-09');
var numDays = 31;
for (var i = 0; i < numDays; i++) {
  var iniDate = start.advance(i, 'day');
  var endDate = end.advance(i, 'day');

  var dataset = ee.ImageCollection('TRMM/3B42')
                    .filter(ee.Filter.date(iniDate, endDate));

  var precipitation = dataset.select(['HQprecipitation']).first();

 
  if (precipitation) {
    var precipitationVisImg = precipitation.visualize(precipitationVis);
    var folderName = 'trmm_2022';
    var dateString = iniDate.format('YYYY_MM_dd').getInfo();
    var description = 'trmm_2022_' + dateString;
    var fileNamePrefix = dateString.concat('_trmm');
    
    Export.image.toDrive({
      image: precipitationVisImg,
      description: description,
      folder: folderName,
      fileNamePrefix: fileNamePrefix,
      region: geometry,
      scale: 1000,
      crs: 'EPSG:4326',
      maxPixels: 1e13
    });
  } else {
    console.log('No image found for date: ' + iniDate.format('YYYY-MM-dd').getInfo());
  }
}
