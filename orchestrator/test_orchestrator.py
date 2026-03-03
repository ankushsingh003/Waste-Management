import requests
import json

def test_orchestrator():
    url = "http://127.0.0.1:8003/analyze"
    payload = {"material_name": "Paper (A4)"}
    
    print(f"Triggering Orchestrator logic for: {payload['material_name']}")
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            print("--- Orchestration Response ---")
            print(json.dumps(response.json(), indent=2))
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Failed to connect to Orchestrator: {e}")

if __name__ == "__main__":
    test_orchestrator()
