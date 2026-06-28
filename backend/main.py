from fastapi import FastAPI
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime

# PostgreSQL Bağlantısı (Kendi bilgilerine göre güncelle)
DATABASE_URL = "postgresql://postgres:admin4361@localhost:5432/quantum_db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class Signal(Base):
    __tablename__ = "signals"
    id = Column(Integer, primary_key=True)
    symbol = Column(String)
    type = Column(String)
    price = Column(Float)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/api/signals")
def get_signals():
    db = SessionLocal()
    return db.query(Signal).order_by(Signal.timestamp.desc()).limit(50).all()