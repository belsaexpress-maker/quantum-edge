import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Quantum Edge v2.0"
    VERSION: str = "2.0.0"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./quantum_edge.db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "quantum-edge-v2-secret-key")
    CMC_API_KEY: str = os.getenv("CMC_API_KEY", "0597e7d1341f4283927ed1beffab9e5a")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))

settings = Settings()