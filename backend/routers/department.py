from fastapi import status, HTTPException, Depends, Response, APIRouter
from typing import List
import models
import schemas
from sqlalchemy.orm import Session
from oauth import get_current_user
from database import get_db

router = APIRouter(
    prefix="/department",
    tags=['Department']
)

@router.post('/create', status_code=status.HTTP_201_CREATED)
def create(request: schemas.Department, db: Session = Depends(get_db), current_user = Depends(get_current_user(['admin']))):
    """Create a department. Admin-only"""
    new_department = models.Department(**request.model_dump())
    db.add(new_department)
    db.commit()
    db.refresh(new_department)
    
    return {"message": "Department created successfully"}

@router.get('/', response_model=List[schemas.Department])
def get_all(db: Session = Depends(get_db), current_user = Depends(get_current_user(['admin', 'student']))):
    """Retrieve all departments"""
    departments = db.query(models.Department).all()
    
    if not departments:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'No departments found')
    
    return departments

@router.put('/update/{id}', status_code=status.HTTP_202_ACCEPTED)
def update(id: int, request: schemas.Department, db: Session = Depends(get_db), current_user = Depends(get_current_user(['admin']))):
    """Update a department"""
    department = db.query(models.Department).filter(models.Department.id == id)
    
    if not department.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Department with id {id} not found')
    
    department.update(**request.model_dump())
    db.commit()
    
    return department

@router.delete('/delete/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user(['admin']))):
    """Delete a department"""
    department = db.query(models.Department).filter(models.Department.id == id)
    
    if not department.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Department with id {id} not found')
    
    department.delete(synchronize_session=False)
    db.commit()
    
    return Response(status_code=status.HTTP_204_NO_CONTENT)