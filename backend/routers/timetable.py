from fastapi import status, HTTPException, Depends, Response, APIRouter
from typing import List
import models
import schemas
from sqlalchemy.orm import Session
from oauth import get_current_user
from database import get_db

router = APIRouter(
    prefix="/timetable",
    tags=['Timetable']
)

"""
NEEDS ATTENTION 
IF ONLY STUDENT IS USED BY THE QUERY SO IT SHOULD BE STUDENT-ONLY
"""
@router.get('/', response_model=List[schemas.Timetable])
def get(db: Session = Depends(get_db), current_user = Depends(get_current_user(['admin', 'student', 'professor']))):
    """Retrieve all the timetables for all courses with existing course ID"""
    student = db.query(models.Student).filter(models.Student.id == current_user.id).first()
    
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Student with id {current_user.id} not found')
    
    courses = db.query(models.Course).filter(models.Course.department_id == student.department_id, models.Course.level_id == student.level_id).all()
    
    if not courses:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'No courses found for this level and department')
    
    course_ids = [course.id for course in courses]
    
    timetable = db.query(models.Timetable).filter(models.Timetable.course_id.in_(course_ids)).all()
    
    return timetable

@router.post('/create', status_code=status.HTTP_201_CREATED)
def create(request: schemas.Timetable, db: Session = Depends(get_db), current_user = Depends(get_current_user(['admin']))):
    """Create timetable. Admin-only"""
    new_timetable = models.Timetable(**request.model_dump())
    db.add(new_timetable)
    db.commit()
    db.refresh(new_timetable)
    
    return {"message": "Timetable created successfully"}

@router.put('/update/{id}', status_code=status.HTTP_202_ACCEPTED)
def update(id: int, request: schemas.Timetable, db: Session = Depends(get_db), current_user = Depends(get_current_user(['admin']))):
    """Update a specific timetable. Admin-only"""
    timetable = db.query(models.Timetable).filter(models.Timetable.id == id)
    
    if not timetable.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Timetable with id {id} not found')
    
    timetable.update(**request.model_dump())
    db.commit()
    
    return {"message": "Timetable updated successfully"}

@router.delete('/delete/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user(['admin']))):
    """Delete a specific timetable. Admin-only"""
    Timetable = db.query(models.Timetable).filter(models.Timetable.id == id)
    
    if not Timetable.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Timetable with id {id} not found')
    
    Timetable.delete(synchronize_session=False)
    db.commit()
    
    return Response(status_code=status.HTTP_204_NO_CONTENT)