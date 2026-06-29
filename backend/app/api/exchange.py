from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.core.database import get_db
from app.models.api_keys import APIKey
from app.services.multi_exchange_service import (
    get_exchange_list, test_connection, get_portfolio, place_order,
    SUPPORTED_EXCHANGES
)
from app.services.crypto_service import encrypt_api_key, decrypt_api_key

router = APIRouter(prefix="/api/exchange", tags=["Exchange"])

class ConnectRequest(BaseModel):
    exchange_id: str
    api_key: str
    api_secret: str
    label: str = "Ana Hesap"

class OrderRequest(BaseModel):
    exchange_id: str
    api_key: str
    api_secret: str
    symbol: str
    side: str  # buy / sell
    amount: float
    price: float = None  # None = market order

@router.get("/exchanges")
def list_exchanges():
    """Desteklenen tüm borsaları listeler"""
    return {"exchanges": get_exchange_list()}

@router.post("/test")
def test(req: ConnectRequest):
    """Borsa bağlantısını test et"""
    return test_connection(req.exchange_id, req.api_key, req.api_secret)

@router.post("/connect")
def connect(req: ConnectRequest, db: Session = Depends(get_db)):
    """Borsa hesabını güvenli şekilde kaydet"""
    existing = db.query(APIKey).filter(
        APIKey.user_id == 1,
        APIKey.exchange == req.exchange_id,
        APIKey.label == req.label
    ).first()
    if existing:
        raise HTTPException(400, "Bu isimde bir hesap zaten var")
    
    # Önce bağlantıyı test et
    result = test_connection(req.exchange_id, req.api_key, req.api_secret)
    if not result.get("success"):
        raise HTTPException(400, f"Bağlantı hatası: {result.get('error')}")
    
    # AES-256 ile şifreleyerek kaydet
    key = APIKey(
        user_id=1,
        exchange=req.exchange_id,
        api_key=encrypt_api_key(req.api_key),
        api_secret=encrypt_api_key(req.api_secret),
        label=req.label
    )
    db.add(key)
    db.commit()
    db.refresh(key)
    
    return {
        "message": "Borsa bağlandı",
        "id": key.id,
        "exchange": req.exchange_id,
        "label": req.label,
        "assets": result.get("count", 0)
    }

@router.get("/accounts")
def list_accounts(db: Session = Depends(get_db)):
    """Bağlı hesapları listele (anahtarlar maskeli)"""
    keys = db.query(APIKey).filter(APIKey.user_id == 1).all()
    return [
        {
            "id": k.id,
            "exchange": k.exchange,
            "exchange_name": SUPPORTED_EXCHANGES.get(k.exchange, k.exchange),
            "label": k.label,
            "api_key": decrypt_api_key(k.api_key)[:8] + "..." if k.api_key else "***",
            "created": k.created_at.isoformat()
        }
        for k in keys
    ]

@router.get("/portfolio/{key_id}")
def view_portfolio(key_id: int, db: Session = Depends(get_db)):
    """Kayıtlı hesabın portföyünü getir (şifre çözülerek)"""
    key = db.query(APIKey).filter(APIKey.id == key_id).first()
    if not key:
        raise HTTPException(404, "Hesap bulunamadı")
    
    return get_portfolio(
        key.exchange,
        decrypt_api_key(key.api_key),
        decrypt_api_key(key.api_secret)
    )

@router.post("/order")
def create_order(req: OrderRequest):
    """Emir ver (doğrudan API anahtarı ile)"""
    return place_order(
        req.exchange_id,
        req.api_key,
        req.api_secret,
        req.symbol,
        req.side,
        req.amount,
        req.price
    )

@router.delete("/disconnect/{key_id}")
def disconnect(key_id: int, db: Session = Depends(get_db)):
    """Hesap bağlantısını kaldır"""
    key = db.query(APIKey).filter(APIKey.id == key_id).first()
    if key:
        db.delete(key)
        db.commit()
        return {"message": "Hesap kaldırıldı"}
    raise HTTPException(404, "Hesap bulunamadı")