var dataset = ee.ImageCollection('MODIS/061/MYD14A2')
                  .filterDate('2017-08-29', '2017-08-30'); // 过滤五月一号的图像
var fireMask = dataset.select('FireMask').first(); // 获取第一幅图像，即五月一号的火灾掩模图像

var fireMaskVis = {
  min: 3.0,
  max: 8.0,
  palette: ['black', 'grey'] // ['blue','green','red'] for color map
};
var countries = ee.FeatureCollection('FAO/GAUL/2015/level0'); 
var italy = countries.filter(ee.Filter.eq('ADM0_NAME', 'Italy')); // 选择意大利

var geometry = italy.geometry(); // 获取意大利的几何信息

Map.setCenter(12.5674, 41.8719, 6); // 将地图中心设置为意大利的中心
Map.addLayer(
    fireMask, fireMaskVis,
    'Fire Mask'); // 在地图上添加火灾掩模图层

var fireMaskVisImg = fireMask.visualize(fireMaskVis); // 应用可视化参数到火灾掩模图像上
Export.image.toDrive({
  image: fireMaskVisImg,
  description: 'fire_mask_map',
  folder: 'GEE_exports',
  region: geometry, // 指定导出的区域
  scale: 1000, // 指定导出的分辨率
  crs: 'EPSG:4326', // 指定投影坐标系
  maxPixels: 1e13 // 指定最大像素数量
});
