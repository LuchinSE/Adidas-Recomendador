from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # ¡Falta esta importación!
from app.routes.auth_routes import router as auth_router

app = FastAPI()
app.include_router(auth_router)

@app.get("/")
async def root():
    return {"message": "Auth Service is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}