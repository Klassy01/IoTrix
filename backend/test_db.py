from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql+psycopg2://myuser:klassy@localhost:5432/iotdb"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

try:
    with engine.connect() as conn:
        print("✅ PostgreSQL connection successful!")
except Exception as e:
    print("❌ Connection failed:", e)
