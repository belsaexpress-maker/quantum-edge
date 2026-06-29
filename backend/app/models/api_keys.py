from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.core.database import Base

class APIKey(Base):
    __tablename__ = "api_keys"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    exchange = Column(String)
    api_key = Column(String)
    api_secret = Column(String)
    label = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)