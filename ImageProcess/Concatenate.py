import torch
from torchvision import transforms
from PIL import Image


def load_image_as_tensor(image_path):
    image = Image.open(image_path)

    transform = transforms.ToTensor()
    tensor = transform(image)
    return tensor


elevation_tensors = [load_image_as_tensor(os.path.join('/content/gdrive/My Drive/test_samples', f'elevation_tile_{i}.png')) for i in range(len(tiles))]
ndvi_tensors = [load_image_as_tensor(os.path.join('/content/gdrive/My Drive/test_samples', f'ndvi_tile_{i}.png')) for i in range(len(tiles))]
ndwi_tensors = [load_image_as_tensor(os.path.join('/content/gdrive/My Drive/test_samples', f'ndwi_tile_{i}.png')) for i in range(len(tiles))]
landcover_tensors = [load_image_as_tensor(os.path.join('/content/gdrive/My Drive/test_samples', f'landcover_tile_{i}.png')) for i in range(len(tiles))]
precipitation_tensors = [load_image_as_tensor(os.path.join('/content/gdrive/My Drive/test_samples', f'precipitation_tile_{i}.png')) for i in range(len(tiles))]
temperature_tensors = [load_image_as_tensor(os.path.join('/content/gdrive/My Drive/test_samples', f'temperature_tile_{i}.png')) for i in range(len(tiles))]

stacked_tensors = []
for i in range(len(tiles)):
    stacked_tensor = torch.cat((elevation_tensors[i], ndvi_tensors[i], ndwi_tensors[i], landcover_tensors[i],precipitation_tensors[i], temperature_tensors[i]), dim=0)
    stacked_tensors.append(stacked_tensor)


output_dir = '/content/gdrive/My Drive/stacked_tensors'
os.makedirs(output_dir, exist_ok=True)

for i, tensor in enumerate(stacked_tensors):
    output_path = os.path.join(output_dir, f'stacked_tensor_{i}.pt')
    torch.save(tensor, output_path)

print("Stacked tensors saved successfully.")
