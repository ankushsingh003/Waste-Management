import io
import cv2
import numpy as np
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from pillow_heif import register_heif_opener
import PIL.ImageOps

from .detector import DefectDetector

# Register HEIF opener for iPhone support
register_heif_opener()

app = FastAPI(title="MarginGuard VQI Service", version="1.0.0")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize detector
detector = DefectDetector()

@app.get("/")
async def root():
    return {"message": "MarginGuard VQI Service is Online", "status": "healthy"}

@app.post("/detect")
async def detect_defects(file: UploadFile = File(...)):
    """
    Endpoint for real-time defect detection.
    Supports JPG, PNG, TIFF, HEIC, WEBP, etc.
    """
    # Relaxed type check since we use Pillow for robust decoding
    content = await file.read()
    
    try:
        # Load image via Pillow (supports TIFF, HEIC, etc.)
        pil_img = Image.open(io.BytesIO(content))
        
        # Convert to RGB (required for YOLO/OpenCV processing)
        if pil_img.mode != "RGB":
            pil_img = pil_img.convert("RGB")
            
        # Convert to OpenCV BGR format
        img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
        
        if img is None:
            raise HTTPException(status_code=400, detail="Could not decode image.")
            
        # Detect
        results = detector.detect(img)
        
        # Add metadata about format
        results["format"] = pil_img.format
        results["mode"] = pil_img.mode
        
        return results
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
