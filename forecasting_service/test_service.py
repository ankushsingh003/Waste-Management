import requests
import time

def test_forecasting_service():
    url = "http://127.0.0.1:8002"
    
    # Wait for service to start
    print("Waiting for Forecasting Service to start and train mock model...")
    for _ in range(30):
        try:
            response = requests.get(url)
            if response.status_code == 200:
                print("Service is Online!")
                break
        except:
            time.sleep(2)
    
    # Test Prediction
    data = {
        "material_name": "Paper (A4)",
        "historical_prices": [50.5, 51.2, 52.0, 51.8, 53.5, 54.0, 54.5, 55.2, 56.0, 56.5]
    }
    
    print(f"Requesting prediction for: {data['material_name']}")
    try:
        res = requests.post(f"{url}/predict", json=data)
        if res.status_code == 200:
            print("Prediction Results:")
            print(res.json())
        else:
            print(f"Error: {res.status_code}")
            print(res.text)
    except Exception as e:
        print(f"Failed to connect: {e}")

if __name__ == "__main__":
    test_forecasting_service()
