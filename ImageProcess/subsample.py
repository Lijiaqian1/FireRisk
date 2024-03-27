import os
import cv2
#run in colab
# Mount Google Drive
from google.colab import drive
drive.mount('/content/gdrive')


temperature_image_path = '/content/gdrive/My Drive/GEE_exports/SouthEastAsia/temperature_map_SEA.tif'
precipitation_image_path = '/content/gdrive/My Drive/GEE_exports/SouthEastAsia/precipitation_map_SEA.tif'
landcover_image_path = '/content/gdrive/My Drive/GEE_exports/SouthEastAsia/land_cover_map_SEA.tif'
elevation_image_path = '/content/gdrive/My Drive/GEE_exports/SouthEastAsia/elevation_map_SEA.tif'

ndvi_image_path = '/content/gdrive/My Drive/GEE_exports/SouthEastAsia/MODIS_NDVI.tif'
ndwi_image_path = '/content/gdrive/My Drive/GEE_exports/SouthEastAsia/MODIS_NDWI.tif'
firemask_image_path = '/content/gdrive/My Drive/GEE_exports/SouthEastAsia/fire_mask_map_SEA_Color.tif'

temperature_image = cv2.imread(temperature_image_path, cv2.IMREAD_UNCHANGED)
precipitation_image = cv2.imread(precipitation_image_path, cv2.IMREAD_UNCHANGED)
landcover_image = cv2.imread(landcover_image_path, cv2.IMREAD_UNCHANGED)
elevation_image = cv2.imread(elevation_image_path, cv2.IMREAD_UNCHANGED)
ndvi_image = cv2.imread(ndvi_image_path, cv2.IMREAD_UNCHANGED)
ndwi_image = cv2.imread(ndwi_image_path, cv2.IMREAD_UNCHANGED)
firemask_image = cv2.imread(firemask_image_path, cv2.IMREAD_UNCHANGED)

# Resize other images to the same dimensions as NDVI and firemask images
target_size = (512, 512)
temperature_image_resized = cv2.resize(temperature_image, target_size)
precipitation_image_resized = cv2.resize(precipitation_image, target_size)
landcover_image_resized = cv2.resize(landcover_image, target_size)
elevation_image_resized = cv2.resize(elevation_image, target_size)
ndvi_image_resized = cv2.resize(ndvi_image, target_size)
ndwi_image_resized = cv2.resize(ndwi_image, target_size)
firemask_image_resized = cv2.resize(firemask_image, target_size)


tile_size = 128

output_dir = '/content/gdrive/My Drive/test_samples'
os.makedirs(output_dir, exist_ok=True)

def split_images(image1, image2, image3, image4, image5, image6, image7, tile_size):
    tiles = []
    for y in range(0, image1.shape[0], tile_size):
        for x in range(0, image1.shape[1], tile_size):
            tile1 = image1[y:y + tile_size, x:x + tile_size]
            tile2 = image2[y:y + tile_size, x:x + tile_size]
            tile3 = image3[y:y + tile_size, x:x + tile_size]
            tile4 = image4[y:y + tile_size, x:x + tile_size]
            tile5 = image5[y:y + tile_size, x:x + tile_size]
            tile6 = image6[y:y + tile_size, x:x + tile_size]
            tile7 = image7[y:y + tile_size, x:x + tile_size]
            tiles.append((tile1, tile2, tile3, tile4, tile5, tile6, tile7))
    return tiles



# Split the images into tiles
tiles = split_images(temperature_image_resized, precipitation_image_resized, landcover_image_resized, elevation_image_resized, ndvi_image_resized, ndwi_image_resized, firemask_image_resized, tile_size)



for i, (temp_tile, precip_tile, landcover_tile, elevation_tile, ndvi_tile, ndwi_tile, firemask_tile) in enumerate(tiles):
    cv2.imwrite(os.path.join(output_dir, f'temperature_tile_{i}.png'), temp_tile)
    cv2.imwrite(os.path.join(output_dir, f'precipitation_tile_{i}.png'), precip_tile)
    cv2.imwrite(os.path.join(output_dir, f'landcover_tile_{i}.png'), landcover_tile)
    cv2.imwrite(os.path.join(output_dir, f'elevation_tile_{i}.png'), elevation_tile)
    cv2.imwrite(os.path.join(output_dir, f'ndvi_tile_{i}.png'), ndvi_tile)
    cv2.imwrite(os.path.join(output_dir, f'ndwi_tile_{i}.png'), ndwi_tile)
    cv2.imwrite(os.path.join(output_dir, f'firemask_tile_{i}.png'), firemask_tile)

print("Image tiles saved successfully.")
