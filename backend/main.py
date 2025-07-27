from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine, SessionLocal
from chatbot import get_bot_response
from models import ChatMessage


Base.metadata.create_all(bind=engine)

app = FastAPI()

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

@app.post("/chat")
def chat(user_message: str, db: Session = Depends(get_db)):
    bot_reply = get_bot_response(user_message, db)
    return {"user": user_message, "bot": bot_reply}

@app.get("/history")
def history(db: Session = Depends(get_db)):
    return db.query(ChatMessage).all()
