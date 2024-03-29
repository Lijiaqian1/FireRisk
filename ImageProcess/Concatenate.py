import torch
from torchvision import transforms
from PIL import Image

# 定义一个函数来加载图像并将其转换为 PyTorch 张量
def load_image_as_tensor(image_path):
    image = Image.open(image_path)
    # 假设你的图像是 RGB 模式的，如果不是，需要进行相应的转换
    transform = transforms.ToTensor()
    tensor = transform(image)
    return tensor

# 加载并转换每种图像
elevation_tensors = [load_image_as_tensor(os.path.join('/content/gdrive/My Drive/test_samples', f'elevation_tile_{i}.png')) for i in range(len(tiles))]
ndvi_tensors = [load_image_as_tensor(os.path.join('/content/gdrive/My Drive/test_samples', f'ndvi_tile_{i}.png')) for i in range(len(tiles))]
ndwi_tensors = [load_image_as_tensor(os.path.join('/content/gdrive/My Drive/test_samples', f'ndwi_tile_{i}.png')) for i in range(len(tiles))]
landcover_tensors = [load_image_as_tensor(os.path.join('/content/gdrive/My Drive/test_samples', f'landcover_tile_{i}.png')) for i in range(len(tiles))]
precipitation_tensors = [load_image_as_tensor(os.path.join('/content/gdrive/My Drive/test_samples', f'precipitation_tile_{i}.png')) for i in range(len(tiles))]
temperature_tensors = [load_image_as_tensor(os.path.join('/content/gdrive/My Drive/test_samples', f'temperature_tile_{i}.png')) for i in range(len(tiles))]
# 其他图像的张量加载和转换与上述类似...

# 使用 torch.cat() 函数将每种图像的张量按照维度1（通道维度）连接在一起，形成新的张量
stacked_tensors = []
for i in range(len(tiles)):
    stacked_tensor = torch.cat((elevation_tensors[i], ndvi_tensors[i], ndwi_tensors[i], landcover_tensors[i],precipitation_tensors[i], temperature_tensors[i]), dim=0)
    stacked_tensors.append(stacked_tensor)

# 将连接的张量保存到 Google Drive 文件夹中
output_dir = '/content/gdrive/My Drive/stacked_tensors'
os.makedirs(output_dir, exist_ok=True)

for i, tensor in enumerate(stacked_tensors):
    output_path = os.path.join(output_dir, f'stacked_tensor_{i}.pt')
    torch.save(tensor, output_path)

print("Stacked tensors saved successfully.")
