import os
import cv2
import numpy as np
import random
from augraphy import AugraphyPipeline
from augraphy.augmentations import InkBleed, InkMottling
import albumentations as A

# 1. Define the Defect Generators
def apply_ink_bleed(image):
    intensity = random.uniform(0.4, 0.8)
    pipeline = AugraphyPipeline(ink_phase=[InkBleed(intensity_range=(intensity, intensity+0.1))])
    result = pipeline(image)
    return result if isinstance(result, np.ndarray) else result['output'] if 'output' in result else image

def apply_misprint(image):
    shift_x = random.randint(3, 8)
    shift_y = random.randint(3, 8)
    rows, cols = image.shape[:2]
    M = np.float32([[1, 0, shift_x], [0, 1, shift_y]])
    overlay = cv2.warpAffine(image, M, (cols, rows))
    alpha = random.uniform(0.2, 0.4)
    return cv2.addWeighted(image, 1 - alpha, overlay, alpha, 0)

def apply_substrate_tear(image):
    mask = np.ones(image.shape[:2], dtype="uint8") * 255
    h, w = image.shape[:2]
    size = random.randint(50, 150)
    x = random.randint(0, max(0, w - size))
    y = random.randint(0, max(0, h - size))
    pts = np.array([[x, y], [x + size, y + size//3], [x + size//2, y + size], [x - 20, y + size//2]], np.int32)
    cv2.fillPoly(mask, [pts], 0)
    return cv2.bitwise_and(image, image, mask=mask)

def apply_contamination(image):
    # Adds "dirt" or "spots"
    pipeline = AugraphyPipeline(ink_phase=[InkMottling()])
    result = pipeline(image)
    return result if isinstance(result, np.ndarray) else result['output'] if 'output' in result else image

# 2. Main Loop
input_dir = "data/good_quality/"
output_dir = "dataset_v1/"
os.makedirs(output_dir, exist_ok=True)

good_images = [f for f in os.listdir(input_dir) if f.lower().endswith(('.jpg', '.png', '.jpeg'))]

if not good_images:
    print("⚠️ No base images found. Please run download_base_images.py first.")
    exit(1)

total_goal = 500
per_base_goal = (total_goal // len(good_images)) + 1
count = 0

print(f"--- Generating {total_goal} Synthetic Images from {len(good_images)} Bases ---")

for img_name in good_images:
    img_path = os.path.join(input_dir, img_name)
    base_img = cv2.imread(img_path)
    if base_img is None: continue
    base_img = cv2.resize(base_img, (640, 640))
    for i in range(per_base_goal):
        if count >= total_goal: break
        good_img = base_img.copy()
        cv2.imwrite(os.path.join(output_dir, f"good_{count}.jpg"), good_img)
        try:
            defect_type = random.choice(["misprint", "bleed", "tear", "dirt"])
            if defect_type == "misprint": res = apply_misprint(base_img)
            elif defect_type == "bleed": res = apply_ink_bleed(base_img)
            elif defect_type == "tear": res = apply_substrate_tear(base_img)
            else: res = apply_contamination(base_img)
            cv2.imwrite(os.path.join(output_dir, f"{defect_type}_{count}.jpg"), res)
            if count % 50 == 0: print(f"Progress: {count}/{total_goal}...")
        except Exception as e:
            print(f"❌ Error on {img_name}: {e}")
        count += 1
print(f"\n✅ Dataset complete in {output_dir}")
