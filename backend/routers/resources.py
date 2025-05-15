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
    prefix="/resources",
    tags=['Resources']
)

MEDIA_DIR = "media/resources"

@router.post('/create', status_code=status.HTTP_201_CREATED)
def create(
    title: str = Form(...),
    course_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db), current_user= Depends(get_current_user(['admin', 'professor']))):
    filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join("media/resources", filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    new_Resource = models.Resource(
        title = title,
        course_id = course_id,
        file_path = file_path
    )
    db.add(new_Resource)
    db.commit()
    db.refresh(new_Resource)
    
    return {"message": "Resource created successfully"}

@router.get('/', response_model=List[schemas.Resource])
def get_all(level: Optional[str], department: Optional[str], db: Session = Depends(get_db), current_user= Depends(get_current_user(['admin', 'professor', 'student']))):
    if level:
        resources = db.query(models.Resource).filter(models.Resource.level == level).all()
    elif department:
        resources = db.query(models.Resource).filter(models.Resource.department == department).all()
    elif level and department:
        resources = db.query(models.Resource).filter(models.Resource.level == level, models.Resource.department == department).all()
    else:   
        resources = db.query(models.Resource).all()
    
    if not resources:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'No resources found')
    
    return resources

@router.put('/update/{id}', status_code=status.HTTP_202_ACCEPTED)
def update(id: int, request: schemas.Resource, db: Session = Depends(get_db), current_user= Depends(get_current_user(['admin', 'professor']))):
    resource = db.query(models.Resource).filter(models.Resource.id == id)
    
    if not resource.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Resource with id {id} not found')
    
    resource.update(**request.model_dump())
    db.commit()
    
    return resource

@router.delete('/delete/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user(['admin']))):
    resource = db.query(models.Resource).filter(models.Resource.id == id)
    
    if not resource.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Resource with id {id} not found')
    
    resource.delete(synchronize_session=False)
    db.commit()
    
    return Response(status_code=status.HTTP_204_NO_CONTENT)