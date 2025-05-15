from fastapi import status, File, UploadFile, Form, HTTPException, Depends, Response, APIRouter
import shutil
import os
import uuid
from typing import List, Optional
import models
import schemas
from sqlalchemy.orm import Session
from oauth import get_current_user
from database import get_db

router = APIRouter(
    prefix="/post",
    tags=['Posts']
)

MEDIA_DIR = "media"

@router.post('/create', status_code=status.HTTP_201_CREATED)
def create(
    title: str = Form(...),
    description: str = Form(...),
    university_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db), current_user= Depends(get_current_user(['admin', 'professor']))):
    filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join("media", filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    new_post = models.Post(
        title = title,
        description = description,
        file_path = file_path,
        university_id = university_id
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    
    return {"message": "Post created successfully"}

@router.get('/', response_model=List[schemas.Post])
def get_all(db: Session = Depends(get_db), current_user= Depends(get_current_user(['admin', 'student']))):
    post = db.query(models.Post).all()
    
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'No post found')
    
    return post

@router.put('/update/{id}', status_code=status.HTTP_202_ACCEPTED)
def update(id: int, request: schemas.Post, db: Session = Depends(get_db), current_user= Depends(get_current_user(['admin']))):
    post = db.query(models.Post).filter(models.Post.id == id)
    
    if not post.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Post with id {id} not found')
    
    post.update(**request.model_dump())
    db.commit()
    
    return post

@router.delete('/delete/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user(['admin']))):
    post = db.query(models.Post).filter(models.Post.id == id)
    
    if not post.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Post with id {id} not found')
    
    post.delete(synchronize_session=False)
    db.commit()
    
    return Response(status_code=status.HTTP_204_NO_CONTENT)