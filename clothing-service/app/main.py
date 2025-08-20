from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles 
from app.middlewares.auth_middlewares import verificar_token
from app.routes import prenda_routes
from app.database.connection import crear_base, engine

app = FastAPI(title="Servicio de prendas")

# Montar carpeta static (asegúrate que la ruta sea correcta)
app.mount("/static", StaticFiles(directory="app/static"), name="static")

#Crear las tablas
crear_base()

#app.middleware("http")(verificar_token)

#Incluir las rutas
app.include_router(prenda_routes.router)