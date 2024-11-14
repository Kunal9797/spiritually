from backend.database import engine
from backend.models import Base

def reset_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("Database tables reset successfully!")

if __name__ == "__main__":
    reset_database()