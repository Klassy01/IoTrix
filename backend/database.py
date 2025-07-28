from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

# Use SQLite as default, PostgreSQL if DATABASE_URL is provided
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./data/iot_chatbot.db")

# Configure engine based on database type
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

# ✅ Connection test on app startup
try:
    with engine.connect() as conn:
        print(f"✅ Database connected! Using: {DATABASE_URL.split('://')[0]}")
except Exception as e:
    print("❌ Database connection failed:", e)
