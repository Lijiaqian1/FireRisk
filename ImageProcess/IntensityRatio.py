import os
import cv2
import numpy as np
import matplotlib.pyplot as plt

from google.colab import drive
drive.mount('/content/gdrive')

fire_intensity_ratios = []
for i in range(16):
    # filename = f'fire_mask_tile_{i}.png'
    file_path=f'/content/gdrive/My Drive/test_samples/firemask_tile_{i}.png'
    image = cv2.imread(file_path)


    hsv_image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    lower_red = np.array([0, 50, 50])
    upper_red = np.array([10, 255, 255])
    lower_green = np.array([40, 50, 50])
    upper_green = np.array([80, 255, 255])

    red_mask = cv2.inRange(hsv_image, lower_red, upper_red)
    green_mask = cv2.inRange(hsv_image, lower_green, upper_green)

    red_area = cv2.countNonZero(red_mask)
    green_area = cv2.countNonZero(green_mask)

    fire_intensity_ratio = red_area / green_area
    fire_intensity_ratios.append(fire_intensity_ratio*1000)

fire_intensity_ratios_array = np.array(fire_intensity_ratios).reshape((4, 4))
print("Fire intensity ratios (4x4 array):")
print(fire_intensity_ratios_array)
