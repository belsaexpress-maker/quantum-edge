import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Quantum Edge v2.0"
    VERSION: str = "2.0.0"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./quantum_edge.db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "quantum-edge-v2-secret-key")
    CMC_API_KEY: str = os.getenv("CMC_API_KEY", "")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")

settings = Settings()