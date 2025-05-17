"""CREATES JWTs"""
from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
import schemas # Later used to decode the tokens

# This is our secret key used to sign tokens
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"

# Algorithm we use to sign our JWT
ALGORITHM = "HS256" 

# Default time a token stays valid (in minutes)
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Creates a token (JWT) that includes the data we give it and an expiration time.

    Parameters:
    - data: A dictionary with information we want to include in the token, like {'user': 'John'}
    - expires_delta: Optional. How long the token should be valid. If not given, uses 30 days.

    Returns:
    - A token string that can be sent to the user
    """
    to_encode = data.copy() # Work on a copy of the data

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        # If no time is given, set the token to expire in 30 days
        expire = datetime.now(timezone.utc) + timedelta(days=30)
    
    # Add expiration info to the data
    to_encode.update({"exp": expire})

    # Turn our data into a JWT string using the secret key and algorithm
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
