from pydantic import BaseModel
from datetime import datetime

class CommentCreate(BaseModel):
    content: str

class CommentOut(BaseModel):
    id: int
    feature_id: int
    user_id: int
    content: str
    timestamp: datetime

    class Config:
        orm_mode = True
