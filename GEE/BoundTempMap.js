var dataset = ee.ImageCollection('MODIS/061/MOD11A2')
                  .filterDate('2022-05-01', '2022-05-02'); // 过滤五月一号的图像
var landSurfaceTemperature = dataset.select('LST_Day_1km').first(); // 获取第一幅图像，即五月一号的图像

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
var geometry = Map.getBounds(true);
Map.setCenter(6.746, 46.529, 2);
Map.addLayer(
    landSurfaceTemperature, landSurfaceTemperatureVis,
    'Land Surface Temperature');
    
Export.image.toDrive({
  image: landSurfaceTemperature,
  description: 'temperature_map',
  folder: 'GEE_exports',
  region: geometry, // 指定导出的区域
  scale: 1000, // 指定导出的分辨率
  crs: 'EPSG:4326', // 指定投影坐标系
  maxPixels: 1e13 // 指定最大像素数量
});

