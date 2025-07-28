from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from database import Base

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_message = Column(String, nullable=False)
    bot_response = Column(String, nullable=False)
    session_id = Column(String, nullable=True)  # ✅ Make it nullable to avoid None errors
    timestamp = Column(DateTime, default=datetime.utcnow)
