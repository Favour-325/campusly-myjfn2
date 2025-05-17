from fastapi import status, HTTPException, Depends, Response, APIRouter
from typing import List
import models
import schemas
from sqlalchemy.orm import Session
from oauth import get_current_user
from database import get_db
from hashing import Hash

router = APIRouter(
    prefix="/professor",
    tags=['Professor']
)

@router.get('/', response_model=List[schemas.Professor])
def get_all(db: Session = Depends(get_db), current_user: schemas.Admin = Depends(get_current_user(['admin']))):
    """Retrieve all professors. Admin-only"""
    professors = db.query(models.Professor).all()
    
    if not professors:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'No professors found')
    
    return professors


@router.post('/create', status_code=status.HTTP_201_CREATED)
def create(request: schemas.Professor, db: Session = Depends(get_db), current_user: schemas.Admin = Depends(get_current_user(allowed_roles=["admin"]))):
    new_professor = models.Professor(email=request.email, password=Hash.bcrypt(request.password))
    """Create a professor. Admin-only"""
    db.add(new_professor)
    db.commit()
    db.refresh(new_professor)
    
    return {"message": "Professor created successfully"}

@router.get('/{id}', response_model=schemas.Professor)
def get(id: int, db: Session = Depends(get_db), current_user: schemas.Professor = Depends(get_current_user(['admin', 'professor']))):
    """Retrieve a professor. Admin-only"""
    professor = db.query(models.Professor).filter(models.Professor.id == id).first()
    
    if not professor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Professor with id {id} not found')
    
    return professor

@router.put('/update/{id}', status_code=status.HTTP_202_ACCEPTED)
def update(id: int, request: schemas.Professor, db: Session = Depends(get_db), current_user = Depends(get_current_user(['admin']))):
    """Update a professor. Admin-only"""
    professor = db.query(models.Professor).filter(models.Professor.id == id)
    
    if not professor.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Professor with id {id} not found')
    
    professor.update(request.model_dump())
    db.commit()
    
    return professor

@router.delete('/delete/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user(['admin']))):
    """Delete a professor. Admin-only"""
    professor = db.query(models.Professor).filter(models.Professor.id == id)
    
    if not professor.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Professor with id {id} not found')
    
    professor.delete(synchronize_session=False)
    db.commit()
    
    return Response(status_code=status.HTTP_204_NO_CONTENT)