from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from tokens import SECRET_KEY, ALGORITHM
from typing import Annotated
import schemas
import models
from jose import JWTError, jwt


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(allowed_roles: list[str] = None):
    def dependency(token: Annotated[str, Depends(oauth2_scheme)]):
        
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_email: str = payload.get("sub")
            role: str = payload.get("role")
            
            if role not in allowed_roles:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Operation not permitted",
                )
                
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
                
            user = user_model.query.filter(user_model.email == user_email).first()
            
            if user is None:
                raise credentials_exception
            
            token_data = schemas.TokenData(user=user, role=role)
        except JWTError:
            raise credentials_exception
        return token_data
        
    return dependency