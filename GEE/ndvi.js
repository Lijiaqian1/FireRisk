var geometry = ee.Geometry.Rectangle([92, 9, 110, 23]);

var mod09a1_0 = ee.ImageCollection("MODIS/061/MOD09A1");

var mod09a1 = mod09a1_0.map(function(img){
  return img.clip(geometry); 
});

var start = ee.Date('2022-2-1');
var end = ee.Date('2022-2-9');
var numDays = 28;


var modisBands = ['sur_refl_b03','sur_refl_b04','sur_refl_b01','sur_refl_b02','sur_refl_b06','sur_refl_b07'];
var IsBands = ['blue','green','red','nir','swir1','swir2'];

function getQABits(image, start, end, newName) {

  var pattern = 0;
  for (var i = start; i<= end; i++){
    pattern += Math.pow(2, i);
  }
  return image.select([0], [newName])
  .bitwiseAnd(pattern)
  .rightShift(start);
}


function maskQuality(image){
  var QA = image.select('StateQA');  
  var internalQuality = getQABits(QA,8,13,'internal_quality_flag');   
  return image.updateMask(internalQuality.eq(0));  
}
var visParams = {bands:['red','green','blue'], min:0, max:3000, gamma:1.3};
  

  
  
  

for (var i = 0; i < numDays; i++){
  var iniDate = start.advance(i, 'day');
  var endDate = end.advance(i, 'day');
  var mod09a1_cf = mod09a1.filterDate(iniDate, endDate)
                        .map(maskQuality)
                        .select(modisBands,IsBands)
  var Cloud = mod09a1.filterDate(iniDate, endDate)
                    .select(modisBands,IsBands)
  

  //Map.addLayer(mod09a1_ndvi.median(), visParam_ndvi, 'NDVI');
  var mod09a1_re = mod09a1_cf.map(function(img){
    return img.reproject('EPSG:4326',null,1000)
  })
  
  
  function NDVI(img) {
   var ndvi = img.normalizedDifference(["nir","red"]);
   return ndvi;
  }
  var mod09a1_ndvi = mod09a1_re.map(NDVI);
  

  var visParam_ndvi = {
   min: -0.2,
   max: 0.8,
   palette: 'FFFFFF, CE7E45, DF923D, F1B555, FCD163, 99B718, 74A901, 66A000, 529400,' +
     '3E8601, 207401, 056201, 004C00, 023B01, 012E01, 011D01, 011301'
  };
  
  var folderName = 'ndvi_2022';
  
  
  //var description = 'firemasks_2021_entire'
  var dateString = iniDate.format('YYYY_MM_dd').getInfo();
  var description = 'ndvi_2022_' + dateString;
  var fileNamePrefix = dateString.concat('_ndvi');
  var exportRegion = geometry;
  Export.image.toDrive({
    image: mod09a1_ndvi.median().visualize(visParam_ndvi), 
    description: description,
    folder: folderName,
    fileNamePrefix: fileNamePrefix,
    region: exportRegion,
    scale: 1000,
    crs: 'EPSG:4326',
    maxPixels: 1e13
  });
}
