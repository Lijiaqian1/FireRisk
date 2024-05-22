var geometry = ee.Geometry.Rectangle([92, 9, 110, 23]);

var mod09a1_0 = ee.ImageCollection("MODIS/061/MOD09A1");
// 批量裁剪
var mod09a1 = mod09a1_0.map(function(img){
  return img.clip(geometry); 
});

var start = ee.Date('2022-8-7');
var end = ee.Date('2022-8-15');
var numDays = 25;

//选择波段并给波段命名
var modisBands = ['sur_refl_b03','sur_refl_b04','sur_refl_b01','sur_refl_b02','sur_refl_b06','sur_refl_b07'];
var IsBands = ['blue','green','red','nir','swir1','swir2'];


//用于提取QA位的辅助函数，主要目的是遍历筛选
function getQABits(image, start, end, newName) {
  //计算需要提取的比特
  var pattern = 0;
  for (var i = start; i<= end; i++){
    pattern += Math.pow(2, i);
  }
  //返回一个提取的QA单波段图像，并给波段起个新名字
  return image.select([0], [newName])
  .bitwiseAnd(pattern)
  .rightShift(start);
}

//去云函数
function maskQuality(image){
  var QA = image.select('StateQA');  //选择QA波段
  var internalQuality = getQABits(QA,8,13,'internal_quality_flag');   //获得internal_cloud_algorithm_flag位置
  return image.updateMask(internalQuality.eq(0));  //返回一个去云图像
}
var visParams = {bands:['red','green','blue'], min:0, max:3000, gamma:1.3};
  

  
  
  

for (var i = 0; i < numDays; i++){
  var iniDate = start.advance(i, 'day');
  var endDate = end.advance(i, 'day');
  //筛选日期、波段并批量进行去云，获得无云（cloud free）影像集合
  var mod09a1_cf = mod09a1.filterDate(iniDate, endDate)
                        .map(maskQuality)
                        .select(modisBands,IsBands)
  //筛选日期和波段，获取有云影像集合  
  var Cloud = mod09a1.filterDate(iniDate, endDate)
                    .select(modisBands,IsBands)
  

  //Map.addLayer(mod09a1_ndvi.median(), visParam_ndvi, 'NDVI');
  var mod09a1_re = mod09a1_cf.map(function(img){
    return img.reproject('EPSG:4326',null,1000)
  })
  
    
  function NDWI(img) {
    var ndwi = img.normalizedDifference(['nir', 'swir1']);
    return ndwi;
  }
  
  // 应用NDWI函数到影像集合
  var mod09a1_ndwi = mod09a1_re.map(NDWI);
  
  // NDWI显示配置
  var visParams_ndwi = {
    min: 0.0,
    max: 1.0,
    palette: ['0000ff', '00ffff', 'ffff00', 'ff0000', 'ffffff'],
  };
  
  var folderName = 'ndwi_2022';
  
  
  //var description = 'firemasks_2021_entire'
  var dateString = iniDate.format('YYYY_MM_dd').getInfo();
  var description = 'ndwi_2022_' + dateString;
  var fileNamePrefix = dateString.concat('_ndwi');
  var exportRegion = geometry;
  Export.image.toDrive({
    image: mod09a1_ndwi.median().visualize(visParams_ndwi), 
    description: description,
    folder: folderName,
    fileNamePrefix: fileNamePrefix,
    region: exportRegion,
    scale: 1000,
    crs: 'EPSG:4326',
    maxPixels: 1e13
  });
}
