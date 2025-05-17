from fastapi import status, HTTPException, Depends, Response, APIRouter
from typing import List
import models
import schemas
from sqlalchemy.orm import Session
from oauth import get_current_user
from database import get_db

router = APIRouter(
    prefix="/level",
    tags=['Level']
)

@router.post('/create', status_code=status.HTTP_201_CREATED)
def create(request: schemas.Level, db: Session = Depends(get_db), current_user = Depends(get_current_user(['admin']))):
    """Create a level"""
    new_level = models.Level(**request.model_dump())
    db.add(new_level)
    db.commit()
    db.refresh(new_level)
    
    return {"message": "Level created successfully"}

@router.get('/', response_model=List[schemas.Level])
def get_all(db: Session = Depends(get_db), current_user = Depends(get_current_user(['admin']))):
    """Retrieve all levels"""
    levels = db.query(models.Level).all()
    
    if not levels:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'No level found')
    
    return levels

@router.put('/update/{id}', status_code=status.HTTP_202_ACCEPTED)
def update(id: int, request: schemas.Level, db: Session = Depends(get_db), current_user = Depends(get_current_user(['admin']))):
    """Update a level"""
    level = db.query(models.Level).filter(models.Level.id == id)
    
    if not level.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Level with id {id} not found')
    
    level.update(request.model_dump())
    db.commit()
    
    return level

@router.delete('/delete/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user(['admin']))):
    """Delete a level"""
    level = db.query(models.Level).filter(models.Level.id == id)
    
    if not level.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Level with id {id} not found')
    
    level.delete(synchronize_session=False)
    db.commit()
    
    return Response(status_code=status.HTTP_204_NO_CONTENT)