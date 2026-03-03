import os
import cv2
import numpy as np
import random
from augraphy import AugraphyPipeline
from augraphy.augmentations import InkBleed, InkMottling
import albumentations as A

# 1. Defect Generators with Bounding Box returns [x_center, y_center, width, height] (YOLO format)
def apply_ink_bleed(image):
    intensity = random.uniform(0.4, 0.8)
    pipeline = AugraphyPipeline(ink_phase=[InkBleed(intensity_range=(intensity, intensity+0.1))])
    result = pipeline(image)
    img = result if isinstance(result, np.ndarray) else result['output'] if 'output' in result else image
    return img, [0.5, 0.5, 0.8, 0.8]

def apply_misprint(image):
    shift_x = random.randint(5, 12)
    shift_y = random.randint(5, 12)
    rows, cols = image.shape[:2]
    M = np.float32([[1, 0, shift_x], [0, 1, shift_y]])
    overlay = cv2.warpAffine(image, M, (cols, rows))
    alpha = random.uniform(0.3, 0.5)
    img = cv2.addWeighted(image, 1 - alpha, overlay, alpha, 0)
    return img, [0.5, 0.5, 0.95, 0.95]

def apply_substrate_tear(image):
    mask = np.ones(image.shape[:2], dtype="uint8") * 255
    h, w = image.shape[:2]
    size_w = random.randint(100, 250)
    size_h = random.randint(50, 150)
    x = random.randint(0, w - size_w)
    y = random.randint(0, h - size_h)
    pts = np.array([[x, y], [x + size_w, y + size_h//2], [x + size_w//2, y + size_h], [x - 20, y + size_h//2]], np.int32)
    cv2.fillPoly(mask, [pts], 0)
    img = cv2.bitwise_and(image, image, mask=mask)
    xc, yc = (x + size_w/2)/w, (y + size_h/2)/h
    nw, nh = size_w/w, size_h/h
    return img, [xc, yc, nw, nh]

def apply_contamination(image):
    pipeline = AugraphyPipeline(ink_phase=[InkMottling()])
    result = pipeline(image)
    img = result if isinstance(result, np.ndarray) else result['output'] if 'output' in result else image
    return img, [0.5, 0.5, 0.9, 0.9]

# 2. Setup Dataset folders
base_path = "d:/PTRN/dataset_v2"
for split in ["train", "val"]:
    os.makedirs(f"{base_path}/{split}/images", exist_ok=True)
    os.makedirs(f"{base_path}/{split}/labels", exist_ok=True)

input_dir = "d:/PTRN/data/good_quality/"
good_images = [f for f in os.listdir(input_dir) if f.lower().endswith(('.jpg', '.png', '.jpeg'))]

classes = {"misprint": 0, "bleed": 1, "tear": 2, "dirt": 3}
total_goal = 600
per_base_goal = (total_goal // len(good_images)) + 1 if good_images else 0
count = 0

print(f"--- Generating {total_goal} Labeled Images ---")

for img_name in good_images:
    img_path = os.path.join(input_dir, img_name)
    base_img = cv2.imread(img_path)
    if base_img is None: continue
    base_img = cv2.resize(base_img, (640, 640))
    
    for _ in range(per_base_goal):
        if count >= total_goal: break
        split = "train" if random.random() < 0.8 else "val"
        fname = f"img_{count}"
        dtype = random.choice(["misprint", "bleed", "tear", "dirt"])
        
        try:
            if dtype == "misprint": res, bbox = apply_misprint(base_img)
            elif dtype == "bleed": res, bbox = apply_ink_bleed(base_img)
            elif dtype == "tear": res, bbox = apply_substrate_tear(base_img)
            else: res, bbox = apply_contamination(base_img)
            
            cv2.imwrite(f"{base_path}/{split}/images/{fname}.jpg", res)
            with open(f"{base_path}/{split}/labels/{fname}.txt", "w") as f:
                f.write(f"{classes[dtype]} {' '.join(map(str, bbox))}\n")
            if count % 100 == 0:
                print(f"Generated {count} images...")
            count += 1
        except Exception as e:
            print(f"Error on {img_name}: {e}")

# Save YAML
yaml_content = f"""
path: {base_path}
train: train/images
val: val/images
names:
  0: misprint
  1: ink_bleed
  2: substrate_tear
  3: contamination
"""
with open(f"{base_path}/data.yaml", "w") as f:
    f.write(yaml_content)

print(f"\n✅ Labeled Dataset complete in {base_path}!")
