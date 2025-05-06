from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class AgentBase(BaseModel):
    name: str
    system_prompt: str
    model: str

class AgentCreate(AgentBase):
    pass

class Agent(AgentBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

class Message(BaseModel):
    content: str
    role: str
    timestamp: datetime

class ChatRequest(BaseModel):
    message: str
    agent_id: str
    use_context: bool = False

class Document(BaseModel):
    id: str
    name: str
    content: str
    agent_id: str
    embedding: Optional[List[float]] = None
    created_at: datetime

class ChatResponse(BaseModel):
    message: str
    agent_id: str
    timestamp: datetime
