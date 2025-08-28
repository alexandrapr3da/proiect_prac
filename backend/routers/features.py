from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from models.models import Feature, User
from schemas.feature import FeatureCreate, FeatureOut, FeatureUpdate
from database import SessionLocal
from fastapi.security import OAuth2PasswordBearer
import requests

router = APIRouter(prefix="/features", tags=["Features"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    headers = {"Authorization": f"token {token}", "Accept": "application/vnd.github+json"}
    response = requests.get("https://api.github.com/user", headers=headers)

    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid GitHub token"
        )

    github_user = response.json()
    username = github_user.get("login")
    github_id = str(github_user.get("id"))
    
    if not username or not github_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="GitHub username not found"
        )

    user = db.query(User).filter(User.github_id == github_id).first()
    if not user:
        user = User(username=username, github_id=github_id)
        db.add(user)
        db.commit()
        db.refresh(user)

    return user
