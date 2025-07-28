from fastapi import FastAPI, Depends
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine, SessionLocal
from chatbot import get_bot_response
from models import ChatMessage
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create database tables
try:
    Base.metadata.create_all(bind=engine)
    logger.info("✅ Database tables created successfully")
except Exception as e:
    logger.error(f"❌ Database setup failed: {e}")

app = FastAPI(title="IoTrix API", version="1.0.0")

# Allow React to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "IoTrix Backend API is running!", "status": "healthy"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "iotrix-backend"}

@app.post("/chat", response_class=PlainTextResponse)
def chat(user_message: str, db: Session = Depends(get_db)):
    try:
        logger.info(f"Chat request: {user_message[:50]}...")
        bot_reply = get_bot_response(user_message, db)
        logger.info("Chat response generated successfully")
        return bot_reply
    except Exception as e:
        logger.error(f"Chat error: {e}")
        return "Sorry, I'm having trouble right now. Please try again."

@app.get("/history")
def history(db: Session = Depends(get_db)):
    try:
        messages = db.query(ChatMessage).all()
        return messages
    except Exception as e:
        logger.error(f"History error: {e}")
        return []
