from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Product

router = APIRouter(prefix="/products")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_product(name: str, cost: float, price: float, db: Session = Depends(get_db)):
    product = Product(name=name, cost=cost, price=price)
    db.add(product)
    db.commit()
    return product

@router.get("/")
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).all()