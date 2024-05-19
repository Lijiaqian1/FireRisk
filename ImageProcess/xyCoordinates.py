import numpy as np
from PIL import Image
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors

image_size = 512

x_coords = np.linspace(1, image_size, image_size)
y_coords = np.linspace(1, image_size, image_size)


x_image = np.tile(x_coords, (image_size, 1))
y_image = np.tile(y_coords.reshape(-1, 1), (1, image_size))


norm = mcolors.Normalize(vmin=1, vmax=image_size)
cmap = plt.cm.viridis


plt.figure(figsize=(12, 6))


plt.subplot(1, 2, 1)
plt.title('X Coordinate Image')
plt.imshow(x_image, cmap=cmap, norm=norm)
plt.colorbar(label='X Coordinate')
plt.xlabel('Pixel Index')
plt.ylabel('Pixel Index')


plt.subplot(1, 2, 2)
plt.title('Y Coordinate Image')
plt.imshow(y_image, cmap=cmap, norm=norm)
plt.colorbar(label='Y Coordinate')
plt.xlabel('Pixel Index')
plt.ylabel('Pixel Index')

plt.tight_layout()


x_image_pil = Image.fromarray((cmap(norm(x_image)) * 255).astype(np.uint8))
y_image_pil = Image.fromarray((cmap(norm(y_image)) * 255).astype(np.uint8))
output_path_x = '/content/gdrive/My Drive/training_images/' + 'xCoordinates_color.tif'
output_path_y = '/content/gdrive/My Drive/training_images/' + 'yCoordinates_color.tif'
x_image_pil.save(output_path_x)
y_image_pil.save(output_path_y)

plt.show()
