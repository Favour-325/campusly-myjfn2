from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import models
from database import engine
from routers import auth, timetable, student, university, hall, level, department, course, professor, admin, resources, post, feedback, message, comment, reaction

app = FastAPI()

origins = [
    'http://localhost:5173',
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # This defines the allowed HTTP methods (GET, POST, etc.)
    allow_headers=["*"],
)

models.Base.metadata.create_all(engine)

routers = [auth, timetable, student, university, hall, level, department, course, professor, admin, resources, post, feedback, message, comment, reaction]

for route in routers:
    app.include_router(route.router)
    
app.mount("/media", StaticFiles(directory="media"), name="media")


""" if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) """