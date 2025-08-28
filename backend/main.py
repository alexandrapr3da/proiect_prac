from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import os

from database import SessionLocal
from models.models import User
from schemas.auth import GitHubLogin, Token
from utils.github import get_github_user
from routers import features, comments, votes, repositories
from datetime import datetime, timedelta
from jose import jwt, JWTError
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY is not set in .env file")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(features.router)
app.include_router(comments.router)
app.include_router(votes.router)
app.include_router(repositories.router)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_access_token(sub: str) -> str:
    to_encode = {"sub": sub, "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@app.post("/token", response_model=Token)
def login_with_github(payload: GitHubLogin, db: Session = Depends(get_db)):
    try:
        gh_user = get_github_user(payload.github_token)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

    username = gh_user.get("login")
    gh_id = str(gh_user.get("id"))

    user = db.query(User).filter(User.github_id == gh_id).first()
    if not user:
        user = User(username=username, github_id=gh_id, github_token=payload.github_token)
        db.add(user)
    else:
        user.username = username
        user.github_token = payload.github_token
    db.commit()
    db.refresh(user)

    access_token = create_access_token(sub=str(user.id))
    return {"access_token": access_token, "token_type": "bearer"}
