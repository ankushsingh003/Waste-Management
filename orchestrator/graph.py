from typing import TypedDict, List, Optional
from langgraph.graph import StateGraph, END
import httpx
import os

# Define the state of our orchestrator
class AgentState(TypedDict):
    vision_data: Optional[dict]
    forecasting_data: Optional[dict]
    material_name: str
    insights: List[str]
    action_required: bool

# Node 1: Analyze Vision Service
async def call_vision_service(state: AgentState):
    """Fetches the latest defect data from the Vision Service."""
    # Note: In a real scenario, we might pass an image ID or fetch latest from DB
    # For now, we simulate calling the running vision service
    print("--- Calling Vision Service ---")
    async with httpx.AsyncClient() as client:
        try:
            # Simulation: We assume the last run data is available or we mock it
            # Since vision service needs an image, we mock the result if no image is provided to orchestrator
            # Alternatively, we just report 'healthy' as a check
            response = await client.get("http://127.0.0.1:8001/")
            state["vision_data"] = {"status": "ok", "message": "Vision system online"}
        except:
            state["vision_data"] = {"status": "error", "message": "Vision system offline"}
    return state

# Node 2: Check Forecasting Service
async def call_forecasting_service(state: AgentState):
    """Fetches price predictions for the material."""
    print(f"--- Calling Forecasting Service for {state['material_name']} ---")
    async with httpx.AsyncClient() as client:
        try:
            # Mock historical data for the check
            payload = {
                "material_name": state["material_name"],
                "historical_prices": [50, 51, 52, 53, 54, 55, 56, 57, 58, 59]
            }
            response = await client.post("http://127.0.0.1:8002/predict", json=payload)
            if response.status_code == 200:
                state["forecasting_data"] = response.json()
            else:
                state["forecasting_data"] = {"error": "Failed to get prediction"}
        except:
            state["forecasting_data"] = {"error": "Forecasting system connection failed"}
    return state

# Node 3: Generate Insights (Business Logic Brain)
def generate_business_insight(state: AgentState):
    """Combines vision and forecasting data to suggest business actions."""
    print("--- Generating Business Insights ---")
    insights = []
    action_required = False
    
    vision = state.get("vision_data", {})
    forecast = state.get("forecasting_data", {})
    
    # Logic: High Defect Rate + Rising Material Price = Maintenance + Bulk Buy
    # (Mocking defect rate for demo logic)
    defect_rate = 6.5 # % (Simulated)
    
    if defect_rate > 5.0:
        insights.append(f"CRITICAL: Defect rate is high ({defect_rate}%). Schedule maintenance for Offset Press #4.")
        action_required = True
        
    if forecast.get("trend") == "up":
        price = forecast.get("predicted_price")
        insights.append(f"WARNING: Predicted price for {state['material_name']} is rising to ${price}. Recommend early bulk purchase.")
        action_required = True
    
    if not action_required:
        insights.append("System operational. No critical actions needed.")
        
    state["insights"] = insights
    state["action_required"] = action_required
    return state

# Build the Graph
def create_orchestrator_graph():
    workflow = StateGraph(AgentState)
    
    # Add Nodes
    workflow.add_node("vision_check", call_vision_service)
    workflow.add_node("forecast_check", call_forecasting_service)
    workflow.add_node("insight_generator", generate_business_insight)
    
    # Set Entry Point
    workflow.set_entry_point("vision_check")
    
    # Define Edges
    workflow.add_edge("vision_check", "forecast_check")
    workflow.add_edge("forecast_check", "insight_generator")
    workflow.add_edge("insight_generator", END)
    
    return workflow.compile()

if __name__ == "__main__":
    import asyncio
    graph = create_orchestrator_graph()
    initial_state = {
        "material_name": "Paper (A4)",
        "vision_data": None,
        "forecasting_data": None,
        "insights": [],
        "action_required": False
    }
    
    async def run():
        result = await graph.ainvoke(initial_state)
        print("\n--- Final Results ---")
        for insight in result["insights"]:
            print(f"- {insight}")
            
    asyncio.run(run())
