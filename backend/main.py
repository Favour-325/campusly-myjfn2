"""MAIN APPLICATION"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # Handle CORS
from fastapi.staticfiles import StaticFiles # For media uploads
import uvicorn
import models # Ensure ORM models are imported
from database import engine # DB engine for creating engine and sessions
from routers import (
    root,
    auth, 
    timetable, 
    student, 
    university, 
    hall, 
    level, 
    department, 
    course, 
    professor, 
    admin, 
    resources, 
    post, 
    feedback, 
    message, 
    comment, 
    reaction
)

# Ensure 'media' directory always exist
if not os.path.isdir("media"):
    os.makedirs("media")

# App instance
app = FastAPI(
    title="School-Platform Management System",
    description="Ensures suitable communications with the client-side",
    contact={
        "name": "F&F",
        "email": "f&f@gmail.com"
    }
)

# Allowed client origins (e.g., your frontend running on localhost:5173)
origins = [
    'http://localhost:5173',
]

# Add CORS middleware to allow requests from the specified origins
app.add_middleware(
    CORSMiddleware, # Prevents request to different domains
    allow_origins=origins, # Only allow this origin
    allow_credentials=True, # Allow frontend to send/receive credentials
    allow_methods=["*"], # Allowed all HTTP methods (GET, POST, etc.)
    allow_headers=["*"], # Allow all HTTP headers
)

# Automatically create database tables based on SQLAlchemy models
models.Base.metadata.create_all(engine)

# List of router modules to include in the app
routers = [root, auth, timetable, student, university, hall, level, department, course, professor, admin, resources, post, feedback, message, comment, reaction]

# Include each route
for route in routers:
    app.include_router(route.router)

# Serve static files    
app.mount(path="/media", app=StaticFiles(directory="media"), name="media")

"""
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 
"""