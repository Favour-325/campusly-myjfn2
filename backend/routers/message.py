from fastapi import status, HTTPException, Depends, Response, APIRouter
from typing import List, Optional
import models
import schemas
from sqlalchemy.orm import Session
from oauth import get_current_user
from database import get_db

router = APIRouter(
    prefix="/messages",
    tags=['Message']
)

@router.post('/create', status_code=status.HTTP_201_CREATED)
def create(request: schemas.Message, db: Session = Depends(get_db), current_user = Depends(get_current_user(['admin']))):
    """Create a message. Admin-only"""
    new_message = models.Message(**request.model_dump())
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    
    return {"message": "Message created successfully"}

@router.get('/', response_model=List[schemas.Message])
def get_all(db: Session = Depends(get_db), current_user = Depends(get_current_user(['admin']))):
    """Retrieve all messages. Admin-only"""
    message = db.query(models.Message).all()
    
    if not message:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'No message found')
    
    return message


@router.get('/student', response_model=List[schemas.Message])
def get_all_by_student(db: Session = Depends(get_db), current_user = Depends(get_current_user(['student']))):
    """Retrieve student messages. Student-only"""
    message = db.query(models.Message).filter(models.Message.student_id == current_user.id).all()
    
    if not message:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'No message found')
    
    return message

@router.delete('/delete/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user(['admin']))):
    """Delete a message. Admin-only"""
    message = db.query(models.Message).filter(models.Message.id == id)
    
    if not message.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Message with id {id} not found')
    
    message.delete(synchronize_session=False)
    db.commit()
    
    return Response(status_code=status.HTTP_204_NO_CONTENT)