"""USER AUTHENTICATION"""
from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
import schemas
import models
import tokens
from sqlalchemy.orm import Session
from database import get_db
from hashing import Hash

router = APIRouter(
    tags=['Authentication'],
)


"""
OAUTH2PASSWORDREQUESTFORM DOESN'T CONTAIN EMAIL ATTRIBUTE: ONLY USERNAME AND PASSWORD.
THIS MIGHT POTENTIALLY CAUSE AN ERROR WHEN USING THE ENDPOINT
"""

@router.post('/login/student')
def login_student(request : OAuth2PasswordRequestForm = Depends(), db : Session = Depends(get_db)) -> dict:
    """
    Was Ideally suppose to Authenticates a student using email and password.
    Returns a JWT token if login is successful.
    """
    student = db.query(models.Student).filter(models.Student.email == request.email).first() 
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Invalid Credentials')
    
    if not Hash.verify(request.password, student.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Incorrect Password')
    
    access_token = tokens.create_access_token(data={"sub": student.email, "role": "student"})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post('/login/admin')
def login_admin(request: OAuth2PasswordRequestForm = Depends(), db : Session = Depends(get_db)) -> dict:
    """
    Authenticates an admin using email and password.
    Returns a JWT token if login is successful.
    """
    admin = db.query(models.Admin).filter(models.Admin.email == request.email).first()
    if not admin:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Invalid Credentials')
    
    if not Hash.verify(request.password, admin.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Incorrect Password')
    
    access_token = tokens.create_access_token(data={"sub": admin.email, "role": "admin"})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post('/login/professor')
def login_professor(request: OAuth2PasswordRequestForm = Depends(), db : Session = Depends(get_db)) -> dict:
    """
    Authenticates a professor using email and password.
    Returns a JWT token if login is successful.
    """
    professor = db.query(models.Professor).filter(models.Professor.email == request.email).first()
    if not professor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Invalid Credentials')
    
    if not Hash.verify(request.password, professor.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Incorrect Password')
    
    access_token = tokens.create_access_token(data={"sub": professor.email, "role": "professor"})
    return {"access_token": access_token, "token_type": "bearer"}