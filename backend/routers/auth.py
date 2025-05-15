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

@router.post('/login/student')
def login_student(request : OAuth2PasswordRequestForm = Depends(), db : Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.email == request.email).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Invalid Credentials')
    
    if not Hash.verify(request.password, student.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Incorrect Password')
    
    access_token = tokens.create_access_token(data={"sub": student.email, "role": "student"})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post('/login/admin')
def login_admin(request: OAuth2PasswordRequestForm = Depends(), db : Session = Depends(get_db)):
    admin = db.query(models.Admin).filter(models.Admin.email == request.email).first()
    if not admin:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Invalid Credentials')
    
    if not Hash.verify(request.password, admin.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Incorrect Password')
    
    access_token = tokens.create_access_token(data={"sub": admin.email, "role": "admin"})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post('/login/professor')
def login_professor(request: OAuth2PasswordRequestForm = Depends(), db : Session = Depends(get_db)):
    professor = db.query(models.Professor).filter(models.Professor.email == request.email).first()
    if not professor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Invalid Credentials')
    
    if not Hash.verify(request.password, professor.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Incorrect Password')
    
    access_token = tokens.create_access_token(data={"sub": professor.email, "role": "professor"})
    return {"access_token": access_token, "token_type": "bearer"}