from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, ARRAY, JSON
from sqlalchemy.sql import func
from database import Base
from passlib.hash import bcrypt
import hashlib

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    birth_date = Column(String)
    birth_time = Column(String, nullable=True)
    location = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def verify_password(self, password: str):
        hashed = hashlib.sha256(password.encode()).hexdigest()
        return hashed == self.hashed_password

    @staticmethod
    def hash_password(password: str):
        return hashlib.sha256(password.encode()).hexdigest()

class Reading(Base):
    __tablename__ = "readings"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    birth_date = Column(String)
    birth_time = Column(String, nullable=True)
    location = Column(String)
    advice = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)  # Make user_id optional

class Philosophy(Base):
    __tablename__ = "philosophies"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(Text)
    origin = Column(String)
    key_principles = Column(JSON)  # Changed from ARRAY to JSON
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Religion(Base):
    __tablename__ = "religions"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(Text)
    sacred_texts = Column(JSON)  # Changed from ARRAY to JSON
    practices = Column(JSON)      # Changed from ARRAY to JSON
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class AstrologicalSystem(Base):
    __tablename__ = "astrological_systems"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    origin = Column(String)
    description = Column(Text)
    key_concepts = Column(JSON)   # Changed from ARRAY to JSON
    zodiac_signs = Column(JSON)   # Changed from ARRAY to JSON
    created_at = Column(DateTime(timezone=True), server_default=func.now())