from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import uvicorn
from .graph import create_orchestrator_graph

app = FastAPI(title="EcoStream Orchestrator Service", version="1.0.0")
graph = create_orchestrator_graph()

class OrchestrationRequest(BaseModel):
    material_name: str

class OrchestrationResponse(BaseModel):
    material_name: str
    insights: List[str]
    action_required: bool
    status: str

@app.get("/")
def read_root():
    return {"service": "Orchestrator", "status": "active"}

@app.post("/analyze", response_model=OrchestrationResponse)
async def analyze_factory_status(request: OrchestrationRequest):
    initial_state = {
        "material_name": request.material_name,
        "vision_data": None,
        "forecasting_data": None,
        "insights": [],
        "action_required": False
    }
    
    try:
        final_state = await graph.ainvoke(initial_state)
        return {
            "material_name": request.material_name,
            "insights": final_state["insights"],
            "action_required": final_state["action_required"],
            "status": "success"
        }
    except Exception as e:
        return {
            "material_name": request.material_name,
            "insights": [f"Error during orchestration: {str(e)}"],
            "action_required": False,
            "status": "error"
        }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8003)
