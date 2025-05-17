from fastapi import status, HTTPException, Depends, Response, APIRouter
from typing import List, Optional
import models
import schemas
from sqlalchemy.orm import Session
from oauth import get_current_user
from database import get_db

router = APIRouter(
    prefix="/course",
    tags=['Course']
)

@router.post('/create', status_code=status.HTTP_201_CREATED)
def create(request: schemas.Course, db: Session = Depends(get_db), current_user = Depends(get_current_user(['admin']))):
    """Create a course. Admin-only"""
    new_course = models.Course(**request.model_dump())
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    
    return {"message": "Course created successfully"}

"""
NEEDS TO CHECK THE TABLE RELATIONHIPS AGAIN
"""
@router.get('/', response_model=List[schemas.Course])
def get_all(level: Optional[str], department: Optional[str], db: Session = Depends(get_db), current_user = Depends(get_current_user(['admin', 'professor', 'student']))):
    """Retrieve all courses"""
    if level:
        courses = db.query(models.Course).filter(models.Course.level == level).all()
    elif department:
        courses = db.query(models.Course).filter(models.Course.department == department).all()
    elif level and department:
        courses = db.query(models.Course).filter(models.Course.level == level, models.Course.department == department).all()
    else:   
        courses = db.query(models.Course).all()
    
    if not courses:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'No departments found')
    
    return courses

@router.put('/update/{id}', status_code=status.HTTP_202_ACCEPTED)
def update(id: int, request: schemas.Course, db: Session = Depends(get_db), current_user = Depends(get_current_user(['admin']))):
    """Modify a course. Admin-only"""
    course = db.query(models.Course).filter(models.Course.id == id)
    
    if not course.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Course with id {id} not found')
    
    course.update(request.model_dump())
    db.commit()
    
    return course

@router.delete('/delete/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user(['admin']))):
    """Delete a course. Admin-only"""
    course = db.query(models.Course).filter(models.Course.id == id)
    
    if not course.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Course with id {id} not found')
    
    course.delete(synchronize_session=False)
    db.commit()
    
    return Response(status_code=status.HTTP_204_NO_CONTENT)