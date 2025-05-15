from pydantic import BaseModel, EmailStr
from typing import Optional, List
from fastapi import File, UploadFile, Form
from models import Semester


# === Level ===
class LevelBase(BaseModel):
    name: str

class Level(LevelBase):
    class Config():
        orm_mode = True


# === Department ===
class DepartmentBase(BaseModel):
    name: str

class Department(DepartmentBase):
    class Config():
        orm_mode = True


# === Hall ===
class HallBase(BaseModel):
    code: str
    university_id: int

class Hall(HallBase):
    class Config():
        orm_mode = True


# === Course ===
class CourseBase(BaseModel):
    name: str
    credits: int
    professor_id: int
    department_id: int

class Course(CourseBase):
    class Config():
        orm_mode = True
        

# === Resource ===
class ResourceBase(BaseModel):
    title: str
    course_id: int
    
class Resource(ResourceBase):
    file_url: str
    class Config():
        orm_mode = True
        

# === Post ===
class PostBase(BaseModel):
    title: str
    university_id: int
    
class Post(PostBase):
    file_url: str
    class Config():
        orm_mode = True
        
# === Comment ===
class CommentBase(BaseModel):
    post_id: int
    content: str
    
class Comment(CommentBase):
    class Config():
        orm_mode = True
        
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
    class Config():
        orm_mode = True
    
class Reaction(ReactionBase):
    class Config():
        orm_mode = True
        



# === Professor ===
class ProfessorBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str

class Professor(ProfessorBase):
    class Config():
        orm_mode = True


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
    class Config():
        orm_mode = True


# === Admin ===
class AdminBase(BaseModel):
    name: str
    password: str
    university_id: int

class Admin(AdminBase):
    class Config():
        orm_mode = True


# === University ===
class UniversityBase(BaseModel):
    name: str
    location: str
    email: str
    phone: str

class University(UniversityBase):
    class Config():
        orm_mode = True


# === Timetable ===
class TimetableBase(BaseModel):
    course_id: int
    professor_id: int
    hall_id: int

class Timetable(TimetableBase):
    class Config():
        orm_mode = True
        
# === Message ===
class MessageBase(BaseModel):
    admin_id: int
    student_id: int
    
class Message(MessageBase):
    subject: str
    content: str
    is_read: bool
    class Config():
        orm_mode = True


class FeedbackBase(BaseModel):
    title: str
    content: str
    
class Feedback(FeedbackBase):
    class Config():
        orm_model = True


# === Auth ===
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user: str | None = None
    role: str | None = None
    