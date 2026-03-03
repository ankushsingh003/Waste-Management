import os
import requests
import numpy as np
import cv2

def download_paper_textures():
    output_dir = "data/good_quality"
    os.makedirs(output_dir, exist_ok=True)
    
    # Mix of reliable direct links
    images = [
        ("paper_opencv.jpg", "https://raw.githubusercontent.com/opencv/opencv/4.x/samples/data/paper.jpg"),
        ("white_paper_pexels.jpg", "https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=1280"),
        ("textured_paper_pexels.jpg", "https://images.pexels.com/photos/235985/pexels-photo-235985.jpeg?auto=compress&cs=tinysrgb&w=1280"),
        ("cardboard_pexels.jpg", "https://images.pexels.com/photos/235986/pexels-photo-235986.jpeg?auto=compress&cs=tinysrgb&w=1280"),
        ("grainy_paper_pexels.jpg", "https://images.pexels.com/photos/606541/pexels-photo-606541.jpeg?auto=compress&cs=tinysrgb&w=1280"),
    ]
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    print(f"--- Downloading Base Images to {output_dir} ---")
    
    downloaded_count = 0
    for filename, url in images:
        target_path = os.path.join(output_dir, filename)
        try:
            print(f"Downloading {filename}...")
            response = requests.get(url, headers=headers, stream=True, timeout=20)
            if response.status_code == 200:
                with open(target_path, 'wb') as f:
                    for chunk in response.iter_content(4096):
                        f.write(chunk)
                print(f"✅ Downloaded {filename} ({os.path.getsize(target_path)} bytes)")
                downloaded_count += 1
            else:
                print(f"❌ Failed {filename} (Status: {response.status_code})")
        except Exception as e:
            print(f"❌ Error {filename}: {e}")

    # Fallback: Create synthetic "perfect" images if folder is still mostly empty
    if downloaded_count < 2:
        print("--- Falling back to Synthetic Base Images ---")
        for i in range(5):
            fname = f"synthetic_base_{i}.jpg"
            # Create slightly textured white paper
            base = np.ones((1024, 1024, 3), dtype=np.uint8) * 250
            noise = np.random.randint(0, 5, (1024, 1024, 3), dtype=np.uint8)
            base = cv2.subtract(base, noise)
            cv2.imwrite(os.path.join(output_dir, fname), base)
            print(f"✅ Created {fname}")

if __name__ == "__main__":
    download_paper_textures()
