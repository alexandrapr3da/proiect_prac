from pydantic import BaseModel

class RepositoryCreate(BaseModel):
    github_id: str
    name: str
    url: str

class RepositoryOut(BaseModel):
    id: int
    github_id: str
    name: str
    url: str

    class Config:
        orm_mode = True
