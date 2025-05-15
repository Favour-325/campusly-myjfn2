from fastapi import status, HTTPException, Depends, Response, APIRouter
from typing import List
import models
import schemas
from sqlalchemy.orm import Session
from oauth import get_current_user
from database import get_db

router = APIRouter(
    prefix="/hall",
    tags=['Hall']
)

@router.post('/create', status_code=status.HTTP_201_CREATED)
def create(request: schemas.Hall, db: Session = Depends(get_db), current_user = Depends(get_current_user(['admin']))):
    new_hall = models.Hall(**request.model_dump())
    db.add(new_hall)
    db.commit()
    db.refresh(new_hall)
    
    return {"message": "Hall created successfully"}

@router.get('/', response_model=List[schemas.Hall])
def get_all(db: Session = Depends(get_db), current_user = Depends(get_current_user(['admin']))):
    halls = db.query(models.Hall).all()
    
    if not halls:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'No hall found')
    
    return halls

@router.put('/update/{id}', status_code=status.HTTP_202_ACCEPTED)
def update(id: int, request: schemas.Hall, db: Session = Depends(get_db), current_user = Depends(get_current_user(['admin']))):
    hall = db.query(models.Hall).filter(models.Hall.id == id)
    
    if not hall.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Hall with id {id} not found')
    
    hall.update(request.model_dump())
    db.commit()
    
    return hall

@router.delete('/delete/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user(['admin']))):
    hall = db.query(models.Hall).filter(models.Hall.id == id)
    
    if not hall.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Hall with id {id} not found')
    
    hall.delete(synchronize_session=False)
    db.commit()
    
    return Response(status_code=status.HTTP_204_NO_CONTENT)