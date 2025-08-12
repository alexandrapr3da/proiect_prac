from fastapi import APIRouter, Depends, HTTPException, Query, Header
from sqlalchemy.orm import Session
from schemas.repository import RepositoryCreate, RepositoryOut
from schemas.feature import FeatureCreate
from models.models import Repository, Feature
from typing import Optional
from database import SessionLocal
from utils.github import search_github_repos, get_issues_from_repo
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

@router.post("/sync/{repo_full_name}", response_model=dict)
def sync_github_issues(
    repo_full_name: str,
    token: str = Header(...),
    db: Session = Depends(get_db),
):
    from github import Github, GithubException

    # try:
    g = Github(token)
    print(repo_full_name)
    print(g)
    repo_obj = g.get_repo("tiangolo/fastapi")  # Fetch repo from GitHub
    print(repo_obj)

    # Check if repo exists in DB
    repo = db.query(Repository).filter(Repository.github_id == str(repo_obj.id)).first()
    if not repo:
        repo = Repository(
            github_id=str(repo_obj.id),
            name=repo_obj.name,
            url=repo_obj.html_url,
        )
        db.add(repo)
        db.commit()
        db.refresh(repo)

    # Fetch open issues
    try:
        issues = repo_obj.get_issues(state="open")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching issues: {e}")

    added = 0
    for issue in issues:
        # Skip pull requests (GitHub returns them as issues sometimes)
        if issue.pull_request is not None:
            continue

        exists = (
            db.query(Feature)
            .filter(Feature.title == issue.title, Feature.repo_id == repo.id)
            .first()
        )
        if not exists:
            feature = Feature(
                title=issue.title,
                description=issue.body or "No description provided.",
                status="open",
                repository=repo,
                user_id=None,  # Could be set if authenticated user is syncing
            )
            db.add(feature)
            added += 1

    db.commit()
    return {"message": f"{added} issues synced from {repo_full_name}"}