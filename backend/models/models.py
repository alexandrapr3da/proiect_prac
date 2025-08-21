from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime
import enum

class VoteType(enum.Enum):
    UP = "up"
    DOWN = "down"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    github_id = Column(String, unique=True, index=True)
    github_token = Column(String)
    features = relationship("Feature", back_populates="user")
    comments = relationship("Comment", back_populates="user")
    votes = relationship("Vote", back_populates="user")

class Repository(Base):
    __tablename__ = "repositories"
    id = Column(Integer, primary_key=True, index=True)
    github_id = Column(String, unique=True, index=True)
    name = Column(String)
    url = Column(String)
    features = relationship("Feature", back_populates="repository")

class Feature(Base):
    __tablename__ = "features"
    id = Column(Integer, primary_key=True, index=True)
    repo_id = Column(Integer, ForeignKey("repositories.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    description = Column(Text)
    status = Column(String, default="open")
    votes = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    repository = relationship("Repository", back_populates="features")
    user = relationship("User", back_populates="features")
    comments = relationship("Comment", back_populates="feature")

class Comment(Base):
    __tablename__ = "comments"
    id = Column(Integer, primary_key=True, index=True)
    feature_id = Column(Integer, ForeignKey("features.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)
    feature = relationship("Feature", back_populates="comments")
    user = relationship("User", back_populates="comments")

class Vote(Base):
    __tablename__ = "votes"
    id = Column(Integer, primary_key=True, index=True)
    feature_id = Column(Integer, ForeignKey("features.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    vote_type = Column(Enum(VoteType))
    feature = relationship("Feature")
    user = relationship("User", back_populates="votes")