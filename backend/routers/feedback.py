from fastapi import status, HTTPException, Depends, Response, APIRouter
from typing import List, Optional
import models
import schemas
from sqlalchemy.orm import Session
from oauth import get_current_user
from database import get_db

router = APIRouter(
    prefix="/feedback",
    tags=['Feedback']
)

@router.post('/create', status_code=status.HTTP_201_CREATED)
def create(request: schemas.Feedback, db: Session = Depends(get_db), current_user = Depends(get_current_user(['student']))):
    new_feedback = models.Feedback(**request.model_dump())
    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)
    
    return {"message": "Feedback created successfully"}

@router.get('/', response_model=List[schemas.Feedback])
def get_all(db: Session = Depends(get_db), current_user = Depends(get_current_user(['admin']))):
    feedback = db.query(models.Feedback).all()
    
    if not feedback:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'No feedback found')
    
    return feedback

@router.delete('/delete/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user(['admin']))):
    feedback = db.query(models.Feedback).filter(models.Feedback.id == id)
    
    if not feedback.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Feedback with id {id} not found')
    
    feedback.delete(synchronize_session=False)
    db.commit()
    
    return Response(status_code=status.HTTP_204_NO_CONTENT)