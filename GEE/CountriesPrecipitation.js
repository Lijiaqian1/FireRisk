// 导入 TRMM 3B42 数据集并选择日期范围
var dataset = ee.ImageCollection('TRMM/3B42')
                  .filter(ee.Filter.date('2019-07-01', '2019-07-02')); // 替换日期为您感兴趣的范围

// 选择降水数据波段
var precipitation = dataset.select(['HQprecipitation']).first();

// 设置降水可视化参数
var precipitationVis = {
  min: 0.1,
  max: 1.2,
  palette: ['blue', 'purple', 'cyan', 'green', 'yellow', 'red'],
};
var countries = ee.FeatureCollection('FAO/GAUL/2015/level0'); 
var italy = countries.filter(ee.Filter.eq('ADM0_NAME', 'Thailand')); // 选择意大利

var geometry = ee.Geometry.Rectangle([92, 9, 110, 23]); // 获取意大利的几何信息

// 将地图中心设置为感兴趣区域
Map.setCenter(-79.98, 23.32, 4);

// 在地图上添加降水图层
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

