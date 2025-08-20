from fastapi import FastAPI
from app.middlewares.auth_middlewares import verificar_token
from app.routes.classification_routes import router as classification_router

app = FastAPI()

app.middleware("http")(verificar_token)

app.include_router(classification_router)