from pydantic import BaseModel
from typing import List, Optional

# Esquema para crear una nueva prenda (sin ID)
class PrendaCreate(BaseModel):
    descripcion: str
    ruta_imagen: str
    categoria: str
    estado: Optional[bool] = True  # opcional, por defecto activa

# Esquema para responder al cliente (incluye ID)
class PrendaResponse(BaseModel):
    id: int
    descripcion: str
    ruta_imagen: str
    categoria: str
    estado: bool
    embedding: Optional[List[float]]= None # Mostrar embadding si está

    class Config:
        from_attributes = True  # Esto permite compatibilidad con SQLAlchemy

# Esquema para actualizar con campos opcionales
class PrendaUpdate(BaseModel):
    descripcion: Optional[str] = None
    ruta_imagen: Optional[str] = None
    categoria: Optional[str] = None
    estado: Optional[bool] = None
