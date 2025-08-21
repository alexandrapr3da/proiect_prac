from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from schemas.repository import RepositoryCreate, RepositoryOut
from models.models import Repository, Feature
from database import SessionLocal
from utils.github import search_github_repos
from routers.features import get_db
from routers.auth import get_current_user
from models.models import User
from github import Github

router = APIRouter(prefix="/repos", tags=["Repositories"])

# ✅ Search GitHub repositories (uses current user’s token)
@router.get("/search")
def search_repositories(
    query: str = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user.github_token:
        raise HTTPException(status_code=401, detail="GitHub token not found for user")
    return search_github_repos(query, current_user.github_token)

# ✅ Add repository to DB
@router.post("/", response_model=RepositoryOut)
def add_repository(
    repo: RepositoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = db.query(Repository).filter(Repository.github_id == repo.github_id).first()
    if existing:
        return existing
    new_repo = Repository(**repo.dict())
    db.add(new_repo)
    db.commit()
    db.refresh(new_repo)
    return new_repo

# ✅ Sync GitHub issues (uses current user’s token automatically)
@router.post("/sync", response_model=dict)
def sync_github_issues(
    repo_full_name: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user.github_token:
        raise HTTPException(status_code=401, detail="GitHub token not found for user")

    g = Github(current_user.github_token)

    try:
        repo_obj = g.get_repo(repo_full_name)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching repo: {e}")

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
                user_id=current_user.id,  # ✅ now linked to the logged-in user
            )
            db.add(feature)
            added += 1

    db.commit()
    return {"message": f"{added} issues synced from {repo_full_name}"}
