from ultralytics import YOLO
import os

# Fix for Windows OMP Error #15
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

def train_vqi_model():
    model = YOLO('yolov8n.pt')
    data_yaml = 'd:/PTRN/dataset_v2/data.yaml'
    print(f"--- Starting Training on {data_yaml} ---")
    results = model.train(
        data=data_yaml,
        epochs=10,
        imgsz=640,
        batch=8,
        name='margin_guard_vqi_v1',
        project='d:/PTRN/training_runs',
        device='cpu'
    )
    print("--- Training Complete! ---")
    best_model_path = os.path.join('d:/PTRN/training_runs', 'margin_guard_vqi_v1', 'weights', 'best.pt')
    print(f"Best model saved at: {best_model_path}")

if __name__ == "__main__":
    train_vqi_model()
