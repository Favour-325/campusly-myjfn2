from fastapi import status, HTTPException, Depends, Response, APIRouter
from typing import List
import models
import schemas
from sqlalchemy.orm import Session
from oauth import get_current_user
from database import get_db

router = APIRouter(
    prefix="/university",
    tags=['University']
)

@router.post('/create', status_code=status.HTTP_201_CREATED)
def create(request: schemas.University, db: Session = Depends(get_db)):
    new_university = models.University(**request.model_dump())
    db.add(new_university)
    db.commit()
    db.refresh(new_university)
    
    return {"message": "University created successfully"}

@router.get('/', response_model=List[schemas.University])
def get_all(db: Session = Depends(get_db), current_user = Depends(get_current_user(['admin', 'student', 'professor']))):
    university = db.query(models.University).all()
    
    if not university:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'No university found')
    
    return university

@router.put('/update/{id}', status_code=status.HTTP_202_ACCEPTED)
def update(id: int, request: schemas.University, db: Session = Depends(get_db), current_user = Depends(get_current_user(['admin']))):
    university = db.query(models.University).filter(models.University.id == id)
    
    if not university.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'University with id {id} not found')
    
    university.update(request.model_dump())
    db.commit()
    
    return university

@router.delete('/delete/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user(['admin']))):
    university = db.query(models.University).filter(models.University.id == id)
    
    if not university.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'University with id {id} not found')
    
    university.delete(synchronize_session=False)
    db.commit()
    
    return Response(status_code=status.HTTP_204_NO_CONTENT)