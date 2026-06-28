from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.websocket_service import live_data

router = APIRouter()

@router.websocket("/ws/live")
async def websocket_endpoint(websocket: WebSocket):
    await live_data.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        live_data.disconnect(websocket)