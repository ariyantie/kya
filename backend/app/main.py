from fastapi import FastAPI

from .database import Base, engine
from .routers import auth, loan

Base.metadata.create_all(bind=engine)

app = FastAPI(title="MariKaya API", version="0.1.0")

app.include_router(auth.router, prefix="/api")
app.include_router(loan.router, prefix="/api")


@app.get("/")
async def root():
    return {"message": "Welcome to MariKaya API"}