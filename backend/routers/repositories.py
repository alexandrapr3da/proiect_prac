from fastapi import APIRouter, Depends, HTTPException, Query, Header
from sqlalchemy.orm import Session
from schemas.repository import RepositoryCreate, RepositoryOut
from models.models import Repository
from database import SessionLocal
from utils.github import search_github_repos
from routers.features import get_db

router = APIRouter(prefix="/repos", tags=["Repositories"])

@router.get("/search")
def search_repositories(query: str = Query(...), token: str = Header()):
    return search_github_repos(query, token)

@router.post("/", response_model=RepositoryOut)
def add_repository(repo: RepositoryCreate, db: Session = Depends(get_db)):
    existing = db.query(Repository).filter(Repository.github_id == repo.github_id).first()
    if existing:
        return existing
    new_repo = Repository(**repo.dict())
    db.add(new_repo)
    db.commit()
    db.refresh(new_repo)
    return new_repo