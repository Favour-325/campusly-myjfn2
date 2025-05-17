from fastapi import status, HTTPException, Depends, Response, APIRouter
from typing import List, Optional
import models
import schemas
from sqlalchemy.orm import Session
from oauth import get_current_user
from database import get_db

router = APIRouter(
    prefix="/reaction",
    tags=['Reaction']
)

@router.post('/create', status_code=status.HTTP_201_CREATED)
def create(request: schemas.Reaction, db: Session = Depends(get_db), current_user = Depends(get_current_user(['student']))):
    """Create a reaction. Student-only"""
    new_reaction = models.Reaction(**request.model_dump())
    db.add(new_reaction)
    db.commit()
    db.refresh(new_reaction)
    
    return new_reaction

@router.get('/', response_model=List[schemas.Reaction])
def get_all(db: Session = Depends(get_db), current_user = Depends(get_current_user(['student']))):
    """Retrieve all reactions details. Student-Only"""
    reaction = db.query(models.Reaction).all()
    
    if not reaction:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    
    return reaction

@router.get('/count', response_model=List[schemas.ReactionCount])
def get_count(post_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user(['student']))):
    """Get counts for all reaction types for a given post"""

    like_count = db.query(models.Reaction).filter(models.Reaction.like == True, models.Reaction.post_id == post_id).count()
    celebrate_count = db.query(models.Reaction).filter(models.Reaction.celebrate == True, models.Reaction.post_id == post_id).count()
    sad_count = db.query(models.Reaction).filter(models.Reaction.sad == True, models.Reaction.post_id == post_id).count()

    result = {
        "post_id": post_id,
        "like": like_count,
        "celebrate": celebrate_count,
        "sad": sad_count
    }

    return [result]  # List of one ReactionCount object

""" @router.delete('/delete/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user(['student']))):
    message = db.query(models.Message).filter(models.Message.id == id)
    
    if not message.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Message with id {id} not found')
    
    message.delete(synchronize_session=False)
    db.commit()
    
    return Response(status_code=status.HTTP_204_NO_CONTENT) """