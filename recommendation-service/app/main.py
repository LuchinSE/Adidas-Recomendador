from fastapi import FastAPI
from app.middlewares.auth_middlewares import verificar_token
from app.routes.recomendacion_routes import router as recomendacion_router
from app.database.connection import Base, engine
from app.models.recomendacion_model import Recomendacion  # importa todos los modelos que quieras crear

# Crea las tablas si no existen
Base.metadata.create_all(bind=engine)

app = FastAPI()

#app.middleware("http")(verificar_token)

app.include_router(recomendacion_router)