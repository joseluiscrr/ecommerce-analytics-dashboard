from fastapi import FastAPI
from database import engine
from models import Base
from routes import auth
from routes import products
from routes import sales
from analytics.insights import get_insights
from fastapi import Depends
from database import SessionLocal

app = FastAPI()
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(sales.router)
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "Working"}

@app.get("/insights")
def insights(db = Depends(get_db)):
    result = get_insights(db)

    return result