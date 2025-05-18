from fastapi import status, HTTPException, Depends, Response, APIRouter
from typing import List, Optional
import models
from utils import count_comments_today
import schemas
from sqlalchemy.orm import Session
from oauth import get_current_user
from database import get_db

router = APIRouter(
    prefix="/comment",
    tags=['Comment']
)

@router.post('/create', status_code=status.HTTP_201_CREATED)
def create(request: schemas.Comment, db: Session = Depends(get_db), current_user = Depends(get_current_user(['student']))):
    """Create a comment. Student-only"""

    """Ensure only 4 comments per day are possible per student"""
    # Count existing comments today
    total = count_comments_today(db=db, student_id=current_user.id)
    if total >= 5:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Comments limit reached (4 per day)")
    

    new_comment = models.Comment(**request.model_dump())
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    
    return new_comment


@router.get('/', response_model=List[schemas.Comment])
def get_all(db: Session = Depends(get_db), current_user = Depends(get_current_user(['student']))):
    """Retrieve all comments. Student-only"""
    comment = db.query(models.Comment).all()
    
    if not comment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    
    return comment

"""COMMENT DELETION IS VERY IMPORTANT"""
""" @router.delete('/delete/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user(['student']))):
    message = db.query(models.Message).filter(models.Message.id == id)
    
    if not message.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Message with id {id} not found')
    
    message.delete(synchronize_session=False)
    db.commit()
    
    return Response(status_code=status.HTTP_204_NO_CONTENT) """