from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from models.models import Comment, Feature, User
from schemas.comment import CommentCreate, CommentOut
from database import SessionLocal
from routers.features import get_current_user, get_db

router = APIRouter(prefix="/features", tags=["Comments"])

@router.post("/{feature_id}/comments", response_model=CommentOut)
def add_comment(feature_id: int, comment: CommentCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    feature = db.query(Feature).filter(Feature.id == feature_id).first()
    if not feature:
        raise HTTPException(status_code=404, detail="Feature not found")
    new_comment = Comment(content=comment.content, user_id=user.id, feature_id=feature_id)
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment

@router.get("/{feature_id}/comments", response_model=List[CommentOut])
def get_comments(feature_id: int, db: Session = Depends(get_db)):
    return db.query(Comment).filter(Comment.feature_id == feature_id).order_by(Comment.timestamp.desc()).all()