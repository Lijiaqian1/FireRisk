from PIL import Image
import os

input_path = "/content/gdrive/My Drive/test_samples"
output_path = "//content/gdrive/My Drive/training_images/landcover"


for filename in os.listdir(input_path):
    if filename.startswith("landcover_tile") and filename.endswith(".png"):
        input_file = os.path.join(input_path, filename)
        output_file = os.path.join(output_path, os.path.splitext(filename)[0] + ".tif")
        png_image = Image.open(input_file)

        png_image.save(output_file)

print("Conversion complete.")
