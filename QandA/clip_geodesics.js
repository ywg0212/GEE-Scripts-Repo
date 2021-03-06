/*
section1, clip 
For a small region, if your roi generated by ee.geometry() and your set the geodesics
as true. Then you perhaps can not your expected result when you
apply it to clip an image.
You can compare the result by swithing false and true in roi statement.

section2, more intuitive understanding on the parameter of geodesic in clip funtion

My assets' sharing links is as following:
https://code.earthengine.google.com/?asset=users/wenjie/MCD12Q1/MCD12Q1_A2016_LC_Type1
https://code.earthengine.google.com/?asset=users/wenjie/TibetShp
*/

var roi = table;

var image = ee.Image("users/wenjie/MCD12Q1/MCD12Q1_A2016_LC_Type1");
var mcd12Q1 = image
print(mcd12Q1);
print('original projection with about 560m')
print('Scale in meters:', mcd12Q1.projection());
print('Scale in meters:', mcd12Q1.projection().nominalScale());

var mcd12Q1_r = mcd12Q1.reproject({crs:"EPSG:4326", scale:500});
print('reprojection with 500m')
print('Scale in meters:', mcd12Q1_r.projection());
print('Scale in meters:', mcd12Q1_r.projection().nominalScale());

var visualization = {
  bands: ['b1'],
  min: 0,
  max: 17,
  Palette:[
  'aec3d4', // water
  '152106', '225129', '369b47', '30eb5b', '387242', // forest
  '6a2325', 'c3aa69', 'b76031', 'd9903d', '91af40',  // shrub, grass
  '111149', // wetlands
  'cdb33b', // croplands
  'cc0013', // urban
  '33280d', // crop mosaic
  'd7cdcc', // snow and ice
  'f7e084', // barren
  '6f6f6f'  // tundra
  ]
};
Map.addLayer(mcd12Q1_r,visualization,'mcd12Q1_r');

var mcd12Q1Focal = mcd12Q1_r.focal_mean(1, 'square', 'pixels', 1)
Map.addLayer(mcd12Q1Focal,visualization,'mcd12Q1Focalbasedonmcd12Q1_r');
print('mcd12Q1Focal')
print('Scale in meters:', mcd12Q1Focal.projection());
print('Scale in meters:', mcd12Q1Focal.projection().nominalScale());

var mcd12Q1Focal_r = mcd12Q1Focal.reproject({crs:"EPSG:4326", scale:500});
Map.addLayer(mcd12Q1Focal_r,visualization,'mcd12Q1Focal_rbasedonmcd12Q1_r');
print('mcd12Q1Focal_r')
print('Scale in meters:', mcd12Q1Focal_r.projection());
print('Scale in meters:', mcd12Q1Focal_r.projection().nominalScale());

var roi = ee.Geometry.Polygon(  // region of interest
        [[126.25, 36],
          [126.25, 35.5],
          [127.05, 35.5],
          [127.05, 36]], null, false);

          
Map.centerObject(roi);
Map.addLayer(roi,{},'geometry');

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
////export to google drive for examine purpose
var mcd12Q1FocalClip = mcd12Q1Focal.clip(roi)
Export.image.toDrive({
  image: mcd12Q1FocalClip,
  description: 'Drive',
  fileNamePrefix:'MCD12Q1FocalClipWithoutReprojection_geodesticfalse',
  folder:'GEE',
  scale:500,
  region:roi,
  crs:'EPSG:4326',
  maxPixels:1e13
  });

var mcd12Q1Focal_r_Clip = mcd12Q1Focal_r.clip(roi)
Export.image.toDrive({
  image: mcd12Q1Focal_r_Clip,
  description: 'Drive',
  fileNamePrefix:'MCD12Q1FocalClipWithReprojection_geodesticfalse',
  folder:'GEE',
  scale:500,
  region:roi,
  crs:'EPSG:4326',
  maxPixels:1e13
  });

/* 
section2, from tutorial
*/

// Create a geodesic polygon.
var polygon = ee.Geometry.Polygon([
  [[-5, 40], [65, 40], [65, 60], [-5, 60], [-5, 60]]
]);

// Create a planar polygon.
var planarPolygon = ee.Geometry(polygon, null, false);

// Display the polygons by adding them to the map.
Map.centerObject(polygon);
Map.addLayer(polygon, {color: 'FF0000'}, 'geodesic polygon');
Map.addLayer(planarPolygon, {color: '000000'}, 'planar polygon');
