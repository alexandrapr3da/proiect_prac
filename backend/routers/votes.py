from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from models.models import Vote, Feature, User, VoteType
from schemas.vote import VoteCreate, VoteOut
from database import SessionLocal
from routers.features import get_current_user, get_db

router = APIRouter(prefix="/features", tags=["Votes"])

@router.post("/{feature_id}/vote", response_model=VoteOut)
def vote_feature(feature_id: int, vote: VoteCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    feature = db.query(Feature).filter(Feature.id == feature_id).first()
    if not feature:
        raise HTTPException(status_code=404, detail="Feature not found")

    existing_vote = db.query(Vote).filter(Vote.feature_id == feature_id, Vote.user_id == user.id).first()

    if existing_vote:
        existing_vote.vote_type = vote.vote_type
    else:
        existing_vote = Vote(feature_id=feature_id, user_id=user.id, vote_type=vote.vote_type)
        db.add(existing_vote)

    upvotes = db.query(Vote).filter(Vote.feature_id == feature_id, Vote.vote_type == VoteType.UP).count()
    downvotes = db.query(Vote).filter(Vote.feature_id == feature_id, Vote.vote_type == VoteType.DOWN).count()
    feature.votes = upvotes - downvotes

    db.commit()
    db.refresh(existing_vote)
    return existing_vote