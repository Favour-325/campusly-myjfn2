from fastapi import status, HTTPException, Depends, Response, APIRouter
from typing import List
import models
import schemas
from sqlalchemy.orm import Session
from oauth import get_current_user
from database import get_db
from hashing import Hash

router = APIRouter(
    prefix="/student",
    tags=['Student']
)

@router.post('/create', status_code=status.HTTP_201_CREATED)
def create(request: schemas.Student, db: Session = Depends(get_db)):
    new_student = models.Student(email=request.email, password=Hash.bcrypt(request.password)) # Create new Student object(Instance)
    """Create a student"""
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    
    return {"message": "Student created successfully"}

@router.get('/{id}', response_model=schemas.Student)
def get(id: int, db: Session = Depends(get_db), current_user: schemas.Student = Depends(get_current_user(['admin', 'student']))):
    """Retrieve a student"""
    student: models.Student = db.query(models.Student).filter(models.Student.id == id).first() # schemas.Student object
    
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Student with id {id} not found')
    
    return student

@router.put('/update/{id}', status_code=status.HTTP_202_ACCEPTED)
def update(id: int, request: schemas.Student, db: Session = Depends(get_db), current_user = Depends(get_current_user(['admin', 'student']))):
    """Update a student"""
    student = db.query(models.Student).filter(models.Student.id == id) # Query object
    
    if not student.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Student with id {id} not found')
    
    student.update(request.model_dump()) # Convert the request to a dictionary
    db.commit()
    
    return student

@router.delete('/delete/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user(['admin']))):
    """Delete a student. Admin-only"""
    student = db.query(models.Student).filter(models.Student.id == id) # Query object
    
    if not student.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Student with id {id} not found')
    
    student.delete(synchronize_session=False)
    db.commit()
    
    return Response(status_code=status.HTTP_204_NO_CONTENT)