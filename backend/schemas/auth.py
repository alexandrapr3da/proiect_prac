from pydantic import BaseModel

class GitHubLogin(BaseModel):
    github_token: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
