from fastapi import APIRouter, Query
from app.services.news_service import get_live_news
from app.services.world_market_service import get_world_prices

router = APIRouter(prefix="/api/market", tags=["Market"])

@router.get("/news")
def get_news():
    return {"news": get_live_news()}

@router.get("/world")
def get_world_markets():
    return {"markets": get_world_prices()}