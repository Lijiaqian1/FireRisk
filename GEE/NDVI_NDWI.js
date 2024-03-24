// 导入法国的边界数据
//var france = ee.FeatureCollection('FAO/GAUL/2015/level0')
  //.filter(ee.Filter.eq('ADM0_NAME', 'France'));

// 获取法国的几何区域
//var geometry = france.geometry();
// 导入意大利西西里岛的边界数据
var france = ee.FeatureCollection('FAO/GAUL/2015/level0')
  .filter(ee.Filter.eq('ADM0_NAME', 'France'));

// 获取意大利西西里岛的几何区域
var geometry = france.geometry();


var mod09a1_0 = ee.ImageCollection("MODIS/061/MOD09A1");
// 批量裁剪
var mod09a1 = mod09a1_0.map(function(img){
  return img.clip(france); // 将裁剪范围改为法国
});

var iniDate = ee.Date.fromYMD(2022,6,1);
var endDate = ee.Date.fromYMD(2022,12,31);

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

//筛选日期、波段并批量进行去云，获得无云（cloud free）影像集合
var mod09a1_cf = mod09a1.filterDate(iniDate, endDate)
                      .map(maskQuality)
                      .select(modisBands,IsBands)
//筛选日期和波段，获取有云影像集合  
var Cloud = mod09a1.filterDate(iniDate, endDate)
                  .select(modisBands,IsBands)


var visParams = {bands:['red','green','blue'], min:0, max:3000, gamma:1.3};

//有云和无云影像可视化，median（）是指按照中位数对影像聚合
Map.centerObject(france, 8)
//Map.addLayer(mod09a1_cf.median(),visParams,'MODIS Composite');
//Map.addLayer(Cloud.median().clip(france),visParams,'MODIS Composite clouds');


//输出image影像的projection和transformation信息，在console栏中查看
print('projection and transformation information:',mod09a1_cf.first().projection());  
print('Pixel size in meters:', mod09a1_cf.first().projection().nominalScale());
//mod09a1_cf数据类型是imageCollection，不能直接使用.projection，所以用.first()提取第一张image查看信息




var mod09a1_re = mod09a1_cf.map(function(img){
  return img.reproject('EPSG:4326',null,250)
})


print('projection and transformation information:',mod09a1_re.first().projection());
print('Pixel size in meters:', mod09a1_re.first().projection().nominalScale());

 //显示重投影后影像
//Map.addLayer(mod09a1_re.median(), visParams, 'Reprojected'); //选用不同的影像聚合方式对最终结果有影响，此处选用的是.median（）



//GEE将计算公式封装为一个方法可以直接调用
function NDVI(img) {
 var ndvi = img.normalizedDifference(["nir","red"]);
 return ndvi;
}
var mod09a1_ndvi = mod09a1_re.map(NDVI);

//NDVI显示配置，NDVI值范围是-1到1
var visParam_ndvi = {
 min: -0.2,
 max: 0.8,
 palette: 'FFFFFF, CE7E45, DF923D, F1B555, FCD163, 99B718, 74A901, 66A000, 529400,' +
   '3E8601, 207401, 056201, 004C00, 023B01, 012E01, 011D01, 011301'
};
Map.addLayer(mod09a1_ndvi.median(), visParam_ndvi, 'NDVI');

var exportRegion = france.geometry();
Export.image.toDrive({
  image: mod09a1_ndvi.median().visualize(visParam_ndvi), 
  description: 'MODIS_NDVI',
  folder: 'GEE_exports',
  region: exportRegion,
  scale: 250,
  crs: 'EPSG:4326',
  maxPixels: 1e13
});



// 定义计算NDWI的函数
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

// 在地图上添加NDWI图层
//Map.addLayer(mod09a1_ndwi.median(), visParams_ndwi, 'NDWI');

// 导出NDWI图层
Export.image.toDrive({
  image: mod09a1_ndwi.median().visualize(visParams_ndwi),
  description: 'MODIS_NDWI',
  folder: 'GEE_exports',
  region: exportRegion,
  scale: 250,
  crs: 'EPSG:4326',
  maxPixels: 1e13
});
