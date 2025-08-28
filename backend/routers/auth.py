from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from datetime import datetime, timedelta
import os
from pydantic import BaseModel

from database import SessionLocal
from models.models import User
from schemas.auth import Token
from utils.github import get_github_user, get_user_repos

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY is not set in .env file")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

router = APIRouter(prefix="/auth", tags=["Authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class GitHubToken(BaseModel):
    github_token: str

@router.post("/token", response_model=Token)
def login_with_github(payload: GitHubToken, db: Session = Depends(get_db)):
    github_user = get_github_user(payload.github_token)
    if not github_user or "error" in github_user:
        raise HTTPException(status_code=401, detail="Invalid GitHub token")

    db_user = db.query(User).filter(User.username == github_user["login"]).first()
    if not db_user:
        db_user = User(
            username=github_user["login"],
            github_id=str(github_user["id"]),
            github_token=payload.github_token,
        )
        db.add(db_user)
    else:
        db_user.github_token = payload.github_token
    db.commit()
    db.refresh(db_user)

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    app_token = jwt.encode(
        {"sub": str(db_user.id), "exp": expire},
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    try:
        repos = get_user_repos(payload.github_token)
    except ValueError:
        repos = []

    return {
        "access_token": app_token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "username": db_user.username,
            "github_id": db_user.github_id,
        },
        "repositories": repos,
    }

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid JWT")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid JWT")

    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "github_id": current_user.github_id,
    }