from database import Base, engine
from models.models import User, Feature, Comment, Vote, Repository

print(Base.metadata.tables.keys())
print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("All tables created.")
