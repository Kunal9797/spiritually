from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, ARRAY, JSON
from sqlalchemy.sql import func
from database import Base
from passlib.hash import bcrypt
from sqlalchemy.orm import relationship
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
            return bcrypt.verify(password, self.hashed_password)

    @staticmethod
    def hash_password(password: str):
            return bcrypt.hash(password)
    readings = relationship("Reading", back_populates="user")

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
    user = relationship("User", back_populates="readings")
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

class UserHistory(Base):
    __tablename__ = "user_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    action_type = Column(String)  # e.g., 'reading', 'search', 'login'
    details = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class UserPreferences(Base):
    __tablename__ = "user_preferences"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), unique=True)
    preferred_system = Column(String)
    notification_settings = Column(JSON)
    theme_preferences = Column(JSON)