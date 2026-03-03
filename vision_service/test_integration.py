import os
import requests
import numpy as np
import cv2
import time

def test_vqi_service():
    # Service URL (local for testing)
    url = "http://localhost:8001/detect"
    
    # Create a dummy "substrate" image (white canvas)
    img = np.ones((1000, 1000, 3), dtype=np.uint8) * 255
    # Draw some "ink bleeds" and "tears" for the mock detector to find
    cv2.circle(img, (200, 200), 50, (0, 0, 255), -1) # Red circle as bleed
    cv2.rectangle(img, (500, 500), (700, 550), (0, 0, 0), -1) # Black rect as tear
    
    _, img_encoded = cv2.imencode('.jpg', img)
    files = {'file': ('test.jpg', img_encoded.tobytes(), 'image/jpeg')}

    print("--- Sending Image to MarginGuard VQI Service ---")
    try:
        response = requests.post(url, files=files)
        if response.status_code == 200:
            data = response.json()
            print(f"Status: SUCCESS")
            print(f"Latency: {data['latency_ms']}ms")
            print(f"Defects Found: {len(data['defects'])}")
            for defect in data['defects']:
                print(f" - [{defect['label']}] Conf: {defect['confidence']} Status: {defect['status']}")
        else:
            print(f"Status: FAILED (Code: {response.status_code})")
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error connecting to service: {e}")

if __name__ == "__main__":
    test_vqi_service()
