from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

# ✅ Connection test on app startup
try:
    with engine.connect() as conn:
        print("✅ PostgreSQL connected!")
except Exception as e:
    print("❌ PostgreSQL connection failed:", e)
