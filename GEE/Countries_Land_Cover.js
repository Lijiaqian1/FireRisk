var dataset = ee.ImageCollection('MODIS/061/MCD12Q1')
                  .filterDate('2022-01-01', '2022-12-31'); 
var igbpLandCover = dataset.select('LC_Type1').first();
var igbpLandCoverVis = {
  min: 1.0,
  max: 17.0,
  palette: [
    '05450a', '086a10', '54a708', '78d203', '009900', 'c6b044', 'dcd159',
    'dade48', 'fbff13', 'b6ff05', '27ff87', 'c24f44', 'a5a5a5', 'ff6d4c',
    '69fff8', 'f9ffa4', '1c0dff'
  ],
};
var countries = ee.FeatureCollection('FAO/GAUL/2015/level0'); 
var france = countries.filter(ee.Filter.eq('ADM0_NAME', 'Italy'));

var geometry = france.geometry();
Map.setCenter(6.746, 46.529, 6);
Map.addLayer(igbpLandCover, igbpLandCoverVis, 'IGBP Land Cover');


var igbpLandCoverVisImg = igbpLandCover.visualize(igbpLandCoverVis);

Export.image.toDrive({
  image: igbpLandCoverVisImg,
  description: 'land_cover_map',
  folder: 'GEE_exports',
  region: geometry,
  scale: 1000,
  crs: 'EPSG:4326',
  maxPixels: 1e13
});
