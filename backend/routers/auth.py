from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from datetime import datetime, timedelta
import os
from pydantic import BaseModel

from database import SessionLocal
from models.models import User
from schemas.auth import Token
from utils.github import get_github_user, get_user_repos  # <-- added get_user_repos

# Load environment variables
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY is not set in .env file")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic model for GitHub token input
class GitHubToken(BaseModel):
    github_token: str

@router.post("/token")
def login_with_github(payload: GitHubToken, db: Session = Depends(get_db)):
    # Step 1: Validate GitHub token
    github_user = get_github_user(payload.github_token)
    if "error" in github_user:
        raise HTTPException(status_code=401, detail="Invalid GitHub token")

    # Step 2: Check if user exists in our DB
    db_user = db.query(User).filter(User.username == github_user["login"]).first()
    if not db_user:
        db_user = User(
            username=github_user["login"],
            github_id=str(github_user["id"]),
            github_token=payload.github_token
        )
        db.add(db_user)
    else:
        db_user.github_token = payload.github_token  # <-- update token if re-login
    db.commit()
    db.refresh(db_user)

    # Step 3: Create JWT for our app (store user.id in sub)
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    app_token = jwt.encode(
        {"sub": str(db_user.id), "exp": expire},
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    # Step 4: Fetch user's repositories
    try:
        repos = get_user_repos(payload.github_token)
    except ValueError as e:
        repos = []

    # Step 5: Return everything
    return {
        "access_token": app_token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "username": db_user.username,
            "github_id": db_user.github_id,
        },
        "repositories": repos  # <-- now included
    }

# Dependency: get current logged-in user from JWT
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
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
