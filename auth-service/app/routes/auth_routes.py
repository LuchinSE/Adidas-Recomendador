import bcrypt
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
from app.services.jwt_service import crear_token
import os

router = APIRouter()

# Asegúrate que esta variable esté seteada correctamente, por ejemplo en tu archivo .env
USER_SERVICE_URL = os.getenv("USER_SERVICE_URL", "http://localhost:8000/api/usuarios/activos")

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
async def login(data: LoginRequest):
    # Consultar todos los usuarios desde el user-service
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"{USER_SERVICE_URL}")
            response.raise_for_status()
            usuarios = response.json()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"No se pudo consultar al user-service: {e}")

    # Buscar el usuario por su correo (el campo en Spring se llama "correo")
    usuario = next((u for u in usuarios if u["correo"] == data.email), None)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Validar contraseña (aquí asumimos que no está hasheada)
    if not bcrypt.checkpw(data.password.encode(), usuario["contrasena"].encode()):
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")

    # Generar JWT
    token = crear_token({
    "sub": usuario["correo"],
    "id": usuario["id"]
    })

    return {"access_token": token, "token_type": "bearer"}