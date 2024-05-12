var startDate = ee.Date('2022-07-26');
var endDate = ee.Date('2022-08-04');
var numDays = 6;
var dayWindow = 8;


var tasks = [];
for (var i = 0; i < numDays; i++) {
  var start = startDate.advance(i, 'day');
  //var end = start.advance(dayWindow, 'day');
  var end = endDate.advance(i, 'day');
  var dataset = ee.ImageCollection('MODIS/061/MYD14A2')
                  .filterDate(start, end); 

  var fireMask = dataset.select('FireMask').first();
  var fireMaskVis = {
    min: 3.0,
    max: 8.0,
    palette: ['blue', 'green', 'red'] 
  };
  
  var geometry = ee.Geometry.Rectangle([92, 9, 110, 23]);
  console.log(start)
  var dateString = start.format('YYYY_MM_dd').getInfo(); 
  var folderName = 'firemasks_2022';

  var description = 'firemasks_2022_' + dateString;

  var fileNamePrefix = dateString.concat('_fire_mask');
  var fireMaskVisImg = fireMask.visualize(fireMaskVis); 

  var task = Export.image.toDrive({
    image: fireMaskVisImg,
    description: description,
    folder: folderName,
    fileNamePrefix: fileNamePrefix, 
    region: geometry, 
    scale: 1000, 
    crs: 'EPSG:4326', 
    maxPixels: 1e13 
  });

  tasks.push(task);
}

