import cv2
import numpy as np
import time
from typing import List, Dict
from ultralytics import YOLO
import os

class DefectDetector:
    def __init__(self, model_path: str = None):
        """
        Initialize the YOLO detector with the trained weights.
        """
        if model_path is None:
            # Default to the best model from the training run
            model_path = r'd:\PTRN\training_runs\margin_guard_vqi_v1\weights\best.pt'
        
        if os.path.exists(model_path):
            self.model = YOLO(model_path)
            print(f"Loaded real YOLO model from: {model_path}")
        else:
            print(f"⚠️ Model path {model_path} not found. Falling back to mock detection.")
            self.model = None
            
        self.classes = ["misprint", "ink_bleed", "substrate_tear", "contamination"]
        
    def detect(self, image_np: np.ndarray) -> Dict:
        """
        Performs detection on the input image.
        """
        start_time = time.time()
        defects = []
        height, width, _ = image_np.shape

        if self.model:
            # Real Inference
            results = self.model(image_np, verbose=False)
            
            for r in results:
                boxes = r.boxes
                for box in boxes:
                    # Get box coordinates in [x1, y1, x2, y2]
                    b = box.xyxy[0].cpu().numpy()
                    cls = int(box.cls[0])
                    conf = float(box.conf[0])
                    
                    label = self.classes[cls] if cls < len(self.classes) else "unknown"
                    
                    defects.append({
                        "label": label,
                        "confidence": round(conf, 3),
                        "bbox": [int(b[0]), int(b[1]), int(b[2]), int(b[3])],
                        "status": "CRITICAL" if conf > 0.8 else "WARNING"
                    })
        else:
            # Fallback Mock logic for demo
            if np.random.random() > 0.7:
                num_defects = np.random.randint(1, 4)
                for _ in range(num_defects):
                    label = np.random.choice(self.classes)
                    conf = float(np.random.uniform(0.75, 0.99))
                    x1 = np.random.randint(0, width // 2)
                    y1 = np.random.randint(0, height // 2)
                    x2 = x1 + np.random.randint(50, 200)
                    y2 = y1 + np.random.randint(50, 200)
                    defects.append({
                        "label": label,
                        "confidence": round(conf, 3),
                        "bbox": [x1, y1, x2, y2],
                        "status": "CRITICAL" if conf > 0.9 else "WARNING"
                    })

        latency = (time.time() - start_time) * 1000
        return {
            "defects": defects,
            "latency_ms": round(latency, 2),
            "timestamp": time.time(),
            "metadata": {
                "image_size": [width, height],
                "model": "YOLO-VQI-Industrial-v1 (Trained)" if self.model else "MOCK"
            }
        }
