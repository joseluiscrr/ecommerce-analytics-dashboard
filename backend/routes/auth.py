from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User
from passlib.context import CryptContext

router = APIRouter()

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register(email: str, password: str, db: Session = Depends(get_db)):
    hashed = pwd_context.hash(password)

    user = User(email=email, password=hashed)
    db.add(user)
    db.commit()

    return {"message": "User created"}

@router.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()

    if not user or not pwd_context.verify(password, user.password):
        return {"error": "Incorrect user or password"}

    return {"message": "Succes login"}