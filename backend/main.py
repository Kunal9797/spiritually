from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional, List
import os
from dotenv import load_dotenv
from openai import OpenAI
from sqlalchemy import or_ 
from utils.history_tracker import track_user_action
from auth import get_current_user

import models
import schemas
import auth
from database import engine, get_db

load_dotenv()
# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
# Create database tables
models.Base.metadata.create_all(bind=engine)

# Load environment variables


app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=False,  # Set to False for now
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def read_root():
    return {"message": "Welcome to Astro Advisor API"}

@app.post("/register", response_model=schemas.User)
async def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    try:  # Add try-except block
        # Debug logging
        print(f"Attempting to register user: {user.email}")
        
        # Check if email exists
        db_user = db.query(models.User).filter(models.User.email == user.email).first()
        if db_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Check if username exists
        db_user = db.query(models.User).filter(models.User.username == user.username).first()
        if db_user:
            raise HTTPException(status_code=400, detail="Username already registered")
        
        # Create new user
        db_user = models.User(
            email=user.email,
            username=user.username,
            hashed_password=models.User.hash_password(user.password),
            birth_date=user.birth_date,
            birth_time=user.birth_time,
            location=user.location
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        print(f"User registered successfully: {user.email}")  # Debug log
        return db_user
        
    except Exception as e:
        print(f"Registration error: {str(e)}")  # Debug log
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Registration failed: {str(e)}"
        )

@app.post("/token", response_model=schemas.Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not user.verify_password(form_data.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(auth.verify_token)):
    return current_user

@app.post("/get-advice", response_model=schemas.Reading)
async def get_advice(
    user_input: schemas.UserInput, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.verify_token)
):
    try:
        prompt = f"""
        Provide brief astrological and spiritual advice for:
        Name: {user_input.name}
        Birth Date: {user_input.birth_date}
        Birth Time: {user_input.birth_time or 'Not provided'}
        Location: {user_input.location}
        """

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a knowledgeable advisor combining astrological and spiritual wisdom."},
                {"role": "user", "content": prompt}
            ]
        )

        advice = response.choices[0].message.content

        # Create database entry with user_id
        db_reading = models.Reading(
            name=user_input.name,
            birth_date=user_input.birth_date,
            birth_time=user_input.birth_time,
            location=user_input.location,
            advice=advice,
            user_id=current_user.id
        )
        db.add(db_reading)
        db.commit()
        db.refresh(db_reading)

        return db_reading

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/readings/", response_model=List[schemas.Reading])
async def get_readings(
    skip: int = 0, 
    limit: int = 10, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.verify_token)
):
    readings = db.query(models.Reading).filter(models.Reading.user_id == current_user.id).offset(skip).limit(limit).all()
    return readings

@app.get("/readings/{reading_id}", response_model=schemas.Reading)
async def get_reading(
    reading_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.verify_token)
):
    reading = db.query(models.Reading).filter(
        models.Reading.id == reading_id,
        models.Reading.user_id == current_user.id
    ).first()
    if reading is None:
        raise HTTPException(status_code=404, detail="Reading not found")
    return reading

@app.put("/users/me", response_model=schemas.User)
async def update_user(
    user_update: schemas.UserUpdate,
    current_user: models.User = Depends(auth.verify_token),
    db: Session = Depends(get_db)
):
    # Update user fields
    for field, value in user_update.dict(exclude_unset=True).items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    return current_user

@app.get("/users/me/readings", response_model=List[schemas.Reading])
async def get_user_readings(
    current_user: models.User = Depends(auth.verify_token),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 10
):
    readings = db.query(models.Reading)\
        .filter(models.Reading.user_id == current_user.id)\
        .order_by(models.Reading.created_at.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()
    return readings

@app.delete("/users/me")
async def delete_user(
    current_user: models.User = Depends(auth.verify_token),
    db: Session = Depends(get_db)
):
    # Delete all user's readings first
    db.query(models.Reading).filter(models.Reading.user_id == current_user.id).delete()
    # Delete the user
    db.delete(current_user)
    db.commit()
    return {"message": "User deleted successfully"}

@app.post("/api/quick-advice", response_model=schemas.Reading)  # Update the route
async def get_quick_advice(user_input: schemas.UserInput, db: Session = Depends(get_db)):
    try:
        prompt = f"""
        Provide brief astrological and spiritual advice for:
        Name: {user_input.name}
        Birth Date: {user_input.birth_date}
        Birth Time: {user_input.birth_time or 'Not provided'}
        Location: {user_input.location}
        
        Please provide a detailed reading including:
        1. General Astrological Insights
        2. Personal Growth Opportunities
        3. Spiritual Guidance
        """

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a knowledgeable spiritual advisor combining astrological wisdom with philosophical insights."},
                {"role": "user", "content": prompt}
            ]
        )

        advice = response.choices[0].message.content

        # Create database entry without user_id
        db_reading = models.Reading(
            name=user_input.name,
            birth_date=user_input.birth_date,
            birth_time=user_input.birth_time,
            location=user_input.location,
            advice=advice
        )
        db.add(db_reading)
        db.commit()
        db.refresh(db_reading)

        return db_reading

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to generate advice: {str(e)}"
        )
    
@app.get("/philosophies/", response_model=List[schemas.Philosophy])
def get_philosophies(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    philosophies = db.query(models.Philosophy).offset(skip).limit(limit).all()
    return philosophies

@app.get("/philosophies/{philosophy_id}", response_model=schemas.Philosophy)
def get_philosophy(philosophy_id: int, db: Session = Depends(get_db)):
    philosophy = db.query(models.Philosophy).filter(models.Philosophy.id == philosophy_id).first()
    if philosophy is None:
        raise HTTPException(status_code=404, detail="Philosophy not found")
    return philosophy

@app.get("/religions/", response_model=List[schemas.Religion])
def get_religions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    religions = db.query(models.Religion).offset(skip).limit(limit).all()
    return religions

@app.get("/religions/{religion_id}", response_model=schemas.Religion)
def get_religion(religion_id: int, db: Session = Depends(get_db)):
    religion = db.query(models.Religion).filter(models.Religion.id == religion_id).first()
    if religion is None:
        raise HTTPException(status_code=404, detail="Religion not found")
    return religion

@app.get("/astrological-systems/", response_model=List[schemas.AstrologicalSystem])
def get_astrological_systems(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    systems = db.query(models.AstrologicalSystem).offset(skip).limit(limit).all()
    return systems

@app.get("/astrological-systems/{system_id}", response_model=schemas.AstrologicalSystem)
def get_astrological_system(system_id: int, db: Session = Depends(get_db)):
    system = db.query(models.AstrologicalSystem).filter(models.AstrologicalSystem.id == system_id).first()
    if system is None:
        raise HTTPException(status_code=404, detail="Astrological system not found")
    return system

# Add search endpoint
@app.get("/search/")
def search_all(query: str, db: Session = Depends(get_db)):
    results = {
        "philosophies": [],
        "religions": [],
        "astrological_systems": []
    }
    
    # Search in philosophies
    philosophies = db.query(models.Philosophy).filter(
        or_(
            models.Philosophy.name.ilike(f"%{query}%"),
            models.Philosophy.description.ilike(f"%{query}%")
        )
    ).all()
    results["philosophies"] = philosophies

    # Search in religions
    religions = db.query(models.Religion).filter(
        or_(
            models.Religion.name.ilike(f"%{query}%"),
            models.Religion.description.ilike(f"%{query}%")
        )
    ).all()
    results["religions"] = religions

    # Search in astrological systems
    systems = db.query(models.AstrologicalSystem).filter(
        or_(
            models.AstrologicalSystem.name.ilike(f"%{query}%"),
            models.AstrologicalSystem.description.ilike(f"%{query}%")
        )
    ).all()
    results["astrological_systems"] = systems

    return results
# Add these new endpoints
@app.post("/guru-chat/{tradition_type}/{tradition_id}")
async def get_guru_response(
    tradition_type: str,
    tradition_id: int,
    message: dict,
    db: Session = Depends(get_db)
):
    try:
        # Get tradition details based on type
        if tradition_type == "philosophy":
            tradition = db.query(models.Philosophy).filter(models.Philosophy.id == tradition_id).first()
        elif tradition_type == "religion":
            tradition = db.query(models.Religion).filter(models.Religion.id == tradition_id).first()
        else:
            tradition = db.query(models.AstrologicalSystem).filter(models.AstrologicalSystem.id == tradition_id).first()

        if not tradition:
            raise HTTPException(status_code=404, detail="Tradition not found")

        # Create context for the AI
        context = f"""
        You are a wise teacher representing {tradition.name}. 
        Key details about this tradition:
        - Description: {tradition.description}
        - Origin: {getattr(tradition, 'origin', 'Unknown')}
        """

        if hasattr(tradition, 'key_principles'):
            context += f"\nKey Principles: {', '.join(tradition.key_principles)}"
        elif hasattr(tradition, 'practices'):
            context += f"\nPractices: {', '.join(tradition.practices)}"
        elif hasattr(tradition, 'key_concepts'):
            context += f"\nKey Concepts: {', '.join(tradition.key_concepts)}"

        # Create the chat completion
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": context},
                {"role": "user", "content": message["content"]}
            ],
            temperature=0.7,
            max_tokens=500
        )

        return {
            "response": response.choices[0].message.content,
            "tradition": tradition.name
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# User Preferences endpoints
@app.post("/users/{user_id}/preferences/", response_model=schemas.UserPreferences)
def create_user_preferences(
    user_id: int,
    preferences: schemas.UserPreferencesCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db_preferences = models.UserPreferences(
        user_id=user_id,
        **preferences.dict()
    )
    db.add(db_preferences)
    db.commit()
    db.refresh(db_preferences)
    return db_preferences

@app.get("/users/{user_id}/preferences/", response_model=schemas.UserPreferences)
def get_user_preferences(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    preferences = db.query(models.UserPreferences).filter(
        models.UserPreferences.user_id == user_id
    ).first()
    if not preferences:
        raise HTTPException(status_code=404, detail="Preferences not found")
    return preferences

# User History endpoints
@app.post("/users/{user_id}/history/", response_model=schemas.UserHistory)
def create_user_history(
    user_id: int,
    history: schemas.UserHistoryCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db_history = models.UserHistory(
        user_id=user_id,
        **history.dict()
    )
    db.add(db_history)
    db.commit()
    db.refresh(db_history)
    return db_history

@app.get("/users/{user_id}/history/", response_model=List[schemas.UserHistory])
def get_user_history(
    user_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    history = db.query(models.UserHistory).filter(
        models.UserHistory.user_id == user_id
    ).offset(skip).limit(limit).all()
    return history

@app.post("/readings/", response_model=schemas.Reading)
async def create_reading(
    reading: schemas.ReadingCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_reading = models.Reading(**reading.dict(), user_id=current_user.id)
    db.add(db_reading)
    db.commit()
    db.refresh(db_reading)
    
    # Track the reading creation
    await track_user_action(
        db=db,
        user_id=current_user.id,
        action_type="create_reading",
        details={"reading_id": db_reading.id}
    )
    
    return db_reading

