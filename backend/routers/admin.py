from fastapi import status, HTTPException, Depends, Response, APIRouter
from typing import List
import models
import schemas
from sqlalchemy.orm import Session
from oauth import get_current_user
from database import get_db
from hashing import Hash

router = APIRouter(
    prefix="/admin",
    tags=['Admin']
)

"""NEEDS CORRECTION CANNOT ACCESS EMAIL FROM schemas.Admin"""
@router.post('/create', status_code=status.HTTP_201_CREATED)
def create(request: schemas.Admin, db: Session = Depends(get_db)):
    """Create an Admin"""
    new_admin = models.Admin(email=request.email, password=Hash.bcrypt(request.password))
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    
    return {"message": "Admin created successfully"}

@router.get('/{id}', response_model=schemas.Admin)
def get(id: int, db: Session = Depends(get_db), current_user: schemas.Admin = Depends(get_current_user(['admin']))):
    """Retrieve an Admin"""
    admin = db.query(models.Admin).filter(models.Admin.id == id).first()
    
    if not admin:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Admin with id {id} not found')
    
    return admin