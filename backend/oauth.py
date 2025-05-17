"""PROTECTS ROUTES BY VERIFYING TOKENS"""
"""GET CURRENT USER AND DECODE HIS TOKENS"""
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from tokens import SECRET_KEY, ALGORITHM
from typing import Annotated # Defines the type and how to get the value
from database import get_db
from sqlalchemy.orm import Session
import schemas
import models
from jose import JWTError, jwt

# Defines where clients send credentials to get a token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

"""
DEPENDECIES ARE CALLED WITHOUT PARAMETERS BY FASTAPI
"""
def get_current_user(allowed_roles: list[str] = []):
    def dependency(
            token: Annotated[str, Depends(oauth2_scheme)],
            db: Session = Depends(get_db)
        ):
        """Dependency function for FastAPI that verifies the token and role"""
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
        try:
            # Decode JWT and verify signature and expiration
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_email: str = payload.get("sub", "")
            role: str = payload.get("role", "")

            if user_email is None or role is None:
                raise credentials_exception
            
            if role not in allowed_roles: # This is a POTENTIAL ERROR in case 'allowed_roles' is None
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Operation not permitted",
                )
            
            # Map role strings to corresponding database models    
            model_map = {
                "student": models.Student,
                "admin": models.Admin,
                "professor": models.Professor
            }
            
            user_model = model_map.get(role)
            if user_model is None:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid role",
                )

            """
            - Now SQLAlchemy will know which database connection to use
            - Query the database to find the user by eamil
            """    
            user = db.query(user_model) \
                 .filter(user_model.email == user_email) \
                 .first()
            
            if user is None:
                raise credentials_exception
            
            # Build a TokenData object to return, containing user info and role
            token_data = schemas.TokenData(user=user, role=role)
        except JWTError:
            raise credentials_exception
        return token_data
        
    return dependency