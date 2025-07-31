from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class FeatureCreate(BaseModel):
    repo_id: int
    title: str
    description: str

class FeatureUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class FeatureOut(BaseModel):
    id: int
    repo_id: int
    user_id: int
    title: str
    description: str
    status: str
    votes: int
    created_at: datetime

    class Config:
        orm_mode = True
