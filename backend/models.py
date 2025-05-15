from database import Base
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean, Enum as SqlEnum, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from enum import Enum

class Semester(str, Enum):
    sem1 = "Semester 1"
    sem2 = "Semester 2"


class University(Base):
    __tablename__ = 'university'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    location = Column(String)
    email = Column(String)
    phone = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    
    students = relationship('Student', back_populates='university')
    professor = relationship('Professor', back_populates='university')
    department = relationship('Department', back_populates='university')
    admin = relationship('Admin', back_populates='university')
    hall = relationship('Hall', back_populates='university')
    post = relationship('Post', back_populates='university')

class Admin(Base):
    __tablename__ = 'admin'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    university_id = Column(String, ForeignKey('university.id'))
    password = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    
    university = relationship('University', back_populates='admin')
    message = relationship('Message', back_populates='admin')
    
class Student(Base):
    __tablename__ = 'student'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    department_id = Column(Integer, ForeignKey('department.id'))
    university_id = Column(Integer, ForeignKey('university.id'))
    password = Column(String)
    comment_id = Column(Integer, ForeignKey('comment.id'))
    level_id = Column(Integer, ForeignKey('level.id'))
    result_id = Column(Integer, ForeignKey('result.id'))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    
    university = relationship('University', back_populates='students')
    department = relationship('Department', back_populates='students')
    level = relationship('Level', back_populates='students')
    result = relationship('Result', back_populates='student')
    comment = relationship('Comment', back_populates='student')
    feedback = relationship('Feedback', back_populates='student')
    reaction = relationship('Reaction', back_populates='student')
    
class Level(Base):
    __tablename__='level'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    
    timetable = relationship('Timetable', back_populates='level')
    students = relationship('Student', back_populates='level')
    course = relationship('Course', back_populates='level')
    
class Course(Base):
    __tablename__ = 'course'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    professor_id = Column(Integer, ForeignKey('professor.id'))
    department_id = Column(String, ForeignKey('department.id'))
    level_id = Column(String, ForeignKey('level.id'))
    credits = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    
    professor = relationship('Professor', back_populates='courses')
    department = relationship('Department', back_populates='courses')
    timetable = relationship('Timetable', back_populates='course')
    level = relationship('Level', back_populates='course')
    resource = relationship('Resource', back_populates='course')

class Resource(Base):
    __tablename__='resource'
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    file_path = Column(String, nullable=True)
    course_id = Column(Integer, ForeignKey('course.id'))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    
    course = relationship('Course', back_populates='resource')
    
class Department(Base):
    __tablename__ = 'department'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    university_id = Column(Integer, ForeignKey('university.id'))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    
    courses = relationship('Course', back_populates='department')
    students = relationship('Student', back_populates='department')
    university = relationship('University', back_populates='department')
    result = relationship('Result', back_populates='department')
    
class Professor(Base):
    __tablename__='professor'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    password = Column(String)
    university_id = Column(Integer, ForeignKey('university.id'))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    
    courses = relationship('Course', back_populates='professor')
    university = relationship('University', back_populates='professor')
    timetable = relationship('Timetable', back_populates='professor')
    
class Hall(Base):
    __tablename__='hall'
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String)
    university_id = Column(Integer, ForeignKey('university.id'))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    
    timetable = relationship('Timetable', back_populates='hall')
    university = relationship('University', back_populates='hall')
    
class Timetable(Base):
    __tablename__='timetable'
    
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey('course.id'))
    professor_id = Column(Integer, ForeignKey('professor.id'))
    hall_id = Column(Integer, ForeignKey('hall.id'))
    level_id = Column(Integer, ForeignKey('level.id'))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    
    level = relationship('Level', back_populates='timetable')
    hall = relationship('Hall', back_populates='timetable')
    course = relationship('Course', back_populates='timetable')
    professor = relationship('Professor', back_populates='timetable')
    
class Comment(Base):
    __tablename__ = 'comment'
    
    id = Column(Integer, primary_key=True, index=True)
    content = Column(String)
    post_id = Column(Integer, ForeignKey('post.id'))
    student_id = Column(Integer, ForeignKey('student.id'), nullable=True)
    
    post = relationship('Post', back_populates='comment')
    student = relationship('Student', back_populates='comment')
    
class Reaction(Base):
    __tablename__ = 'reaction'
    
    id = Column(Integer, primary_key=True, index=True)
    like = Column(Boolean, default=False)
    celebrate = Column(Boolean, default=False)
    sad = Column(Boolean, default=False)
    post_id = Column(Integer, ForeignKey('post.id'))
    student_id = Column(Integer, ForeignKey('student.id'), nullable=True)
    
    post = relationship('Post', back_populates='reaction')
    student = relationship('Student', back_populates='reaction')
    
class Post(Base):
    __tablename__= 'post'
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=True)
    description = Column(Text)
    file_path = Column(String, nullable=True)
    university_id = Column(Integer, ForeignKey('university.id'))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    
    university = relationship('University', back_populates='post')
    comment = relationship('Comment', back_populates='post')
    reaction = relationship('Reaction', back_populates='post')
    
class Message(Base):
    __tablename__ = 'message'
    
    id = Column(Integer, primary_key=True, index=True)
    admin_id = Column(Integer, ForeignKey("admin.id", ondelete="SET NULL"), nullable=False)
    student_id = Column(Integer, ForeignKey("student.id", ondelete="SET NULL"), nullable=False)
    subject = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    admin = relationship("Admin", back_populates="message")
    student = relationship("Admin", back_populates="message")

class Result(Base):
    __tablename__= 'result'
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    file_path = Column(String, nullable=True)
    department_id = Column(Integer, ForeignKey('department.id'))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    
    department = relationship('Department', back_populates='result')
    
class Feedback(Base):
    __tablename__= "feedback"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey('student.id'))
    title = Column(String)
    content = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    
    student = relationship('Student', back_populates='feedback')