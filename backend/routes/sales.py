from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Sale

router = APIRouter(prefix="/sales")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_sale(product_id: int, quantity: int, db: Session = Depends(get_db)):
    sale = Sale(product_id=product_id, quantity=quantity)
    db.add(sale)
    db.commit()
    return sale

@router.get("/")
def get_sales(db: Session = Depends(get_db)):
    return db.query(Sale).all()