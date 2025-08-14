from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from jose import jwt
from datetime import datetime, timedelta
import os
from pydantic import BaseModel

from database import SessionLocal
from models.models import User
from schemas.User import Token
from utils.github import get_github_user

# Load environment variables
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY is not set in .env file")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic model for GitHub token input
class GitHubToken(BaseModel):
    github_token: str

@router.post("/token", response_model=Token)
def login_with_github(payload: GitHubToken, db: Session = Depends(get_db)):
    # Step 1: Validate GitHub token
    github_user = get_github_user(payload.github_token)
    if "error" in github_user:
        raise HTTPException(status_code=401, detail="Invalid GitHub token")

    # Step 2: Check if user exists in our DB
    db_user = db.query(User).filter(User.username == github_user["login"]).first()
    if not db_user:
        db_user = User(username=github_user["login"])
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

    # Step 3: Create JWT for our app
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    app_token = jwt.encode(
        {"sub": github_user["login"], "exp": expire},
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return {"access_token": app_token, "token_type": "bearer"}
