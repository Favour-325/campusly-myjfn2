"""GIVES YOU A SESSION FOR EVERY REQUEST"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base # Base class for ORM models
from sqlalchemy.orm import sessionmaker # Factory for DB sessions

DATABASE_URL = 'sqlite:///./campusly.db'

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

"""A session is a worker who can read from and write to the DB"""
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

# Base class for all ORM models to inherit from
Base = declarative_base()

def get_db():
    """Dependency function to provide a DB session for each request"""
    db = SessionLocal() # Creates a new DB session 
    try:
        yield db # Provide the session to the caller
    finally:
        db.close()