"""ENSURES ONLY VALID DATA FLOWS IN AND OUT"""
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from fastapi import File, UploadFile, Form
from models import Semester


# === Level ===
class LevelBase(BaseModel):
    name: str

class Level(LevelBase):
    class Config:
        model_config = {
            "from_attributes": True
        }


# === Department ===
class DepartmentBase(BaseModel):
    name: str

class Department(DepartmentBase):
    class Config:
        model_config = {
            "from_attributes": True
        }


# === Hall ===
class HallBase(BaseModel):
    code: str
    university_id: int


class Hall(HallBase):
    class Config:
        model_config = {
            "from_attributes": True
        }


# === Course ===
class CourseBase(BaseModel):
    name: str
    credits: int
    professor_id: int
    department_id: int

class Course(CourseBase):
    class Config:
        model_config = {
            "from_attributes": True
        }
        

# === Resource ===
class ResourceBase(BaseModel):
    title: str
    course_id: int
    
class Resource(ResourceBase):
    file_url: str
    class Config:
        model_config = {
            "from_attributes": True
        }
        

# === Post ===
class PostBase(BaseModel):
    title: str
    university_id: int
    
class Post(PostBase):
    file_url: str
    class Config:
        model_config = {
            "from_attributes": True
        }
        
# === Comment ===
class CommentBase(BaseModel):
    post_id: int
    content: str
    
class Comment(CommentBase):
    class Config:
        model_config = {
            "from_attributes": True
        }
        
# === Reaction === 
class ReactionBase(BaseModel):
    post_id: int
    like: bool
    celebrate: bool
    sad: bool
    
class ReactionCount(BaseModel):
    post_id: int
    like: int
    celebrate: int
    sad: int
    class Config:
        model_config = {
            "from_attributes": True
        }
    
class Reaction(ReactionBase):
    class Config:
        model_config = {
            "from_attributes": True
        }
        



# === Professor ===
class ProfessorBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str

class Professor(ProfessorBase):
    class Config:
        model_config = {
            "from_attributes": True
        }


# === Student ===
class StudentBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str
    department_id: int
    university_id: int
    level_id: int

class Student(StudentBase):
    class Config:
        model_config = {
            "from_attributes": True
        }


# === Admin ===
class AdminBase(BaseModel):
    name: str
    password: str
    university_id: int

class Admin(AdminBase):
    class Config:
        model_config = {
            "from_attributes": True
        }


# === University ===
class UniversityBase(BaseModel):
    name: str
    location: str
    email: str
    phone: str

class University(UniversityBase):
    class Config:
        model_config = {
            "from_attributes": True
        }


# === Timetable ===
class TimetableBase(BaseModel):
    course_id: int
    professor_id: int
    hall_id: int

class Timetable(TimetableBase):
    class Config:
        model_config = {
            "from_attributes": True
        }
        
# === Message ===
class MessageBase(BaseModel):
    admin_id: int
    student_id: int
    
class Message(MessageBase):
    subject: str
    content: str
    is_read: bool
    class Config:
        model_config = {
            "from_attributes": True
        }


class FeedbackBase(BaseModel):
    title: str
    content: str
    
class Feedback(FeedbackBase):
    class Config:
        model_config = {
            "from_attributes": True
        }


# === Auth ===
class Token(BaseModel):
    """
    This class represents the actual authentication token 
    that is sent back to the client after login 
    (usually a JWT token).
    """
    access_token: str
    token_type: str

class TokenData(BaseModel):
    """
    This class represents the data extracted 
    from the token once it is decoded and verified.
    """
    """
    - Decode and validate the JWT token sent with the request.
    - Extract the user’s identity and role from the token (like their email and role):
    """
    user: str | None = None
    role: str | None = None
    