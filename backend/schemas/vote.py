from pydantic import BaseModel
from enum import Enum

class VoteType(str, Enum):
    UP = "up"
    DOWN = "down"

class VoteCreate(BaseModel):
    vote_type: VoteType

class VoteOut(BaseModel):
    id: int
    feature_id: int
    user_id: int
    vote_type: VoteType

    class Config:
        orm_mode = True
