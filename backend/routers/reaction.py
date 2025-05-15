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
    new_reaction = models.Reaction(**request.model_dump())
    db.add(new_reaction)
    db.commit()
    db.refresh(new_reaction)
    
    return new_reaction

@router.get('/', response_model=List[schemas.Reaction])
def get_all(db: Session = Depends(get_db), current_user = Depends(get_current_user(['student']))):
    reaction = db.query(models.Reaction).all()
    
    if not reaction:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    
    return reaction

@router.get('/count', response_model=List[schemas.ReactionCount])
def get_count(post_id: int, emoji: str, db: Session = Depends(get_db), current_user = Depends(get_current_user(['student']))):
    if emoji not in ['like', 'celebrate', 'sad']:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Invalid emoji type')
    
    reaction = db.query(models.Reaction).filter(getattr(models.Reaction, emoji) == True, models.Reaction.post_id == post_id).count()
    
    return reaction

""" @router.delete('/delete/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user(['student']))):
    message = db.query(models.Message).filter(models.Message.id == id)
    
    if not message.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Message with id {id} not found')
    
    message.delete(synchronize_session=False)
    db.commit()
    
    return Response(status_code=status.HTTP_204_NO_CONTENT) """