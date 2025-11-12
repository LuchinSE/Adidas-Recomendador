from pydantic import BaseModel
from typing import List, Optional

# Esquema para crear una nueva prenda (sin ID)
class PrendaCreate(BaseModel):
    descripcion: str
    ruta_imagen: str
    categoria: str
    precio: float
    estado: Optional[bool] = True  # opcional, por defecto activa
    usuario_id: int

# Esquema para responder al cliente (incluye ID)
class PrendaResponse(BaseModel):
    id: int
    descripcion: str
    ruta_imagen: str
    categoria: str
    precio: float
    estado: bool
    embedding: Optional[List[float]]= None # Mostrar embadding si está
    usuario_id: int
    class Config:
        from_attributes = True  # Esto permite compatibilidad con SQLAlchemy

# Esquema para actualizar con campos opcionales
class PrendaUpdate(BaseModel):
    descripcion: Optional[str] = None
    ruta_imagen: Optional[str] = None
    categoria: Optional[str] = None
    precio: Optional[float] = None
    estado: Optional[bool] = None
    usuario_id: Optional[int] = None


class PaginatedPrendaResponse(BaseModel):
    total: int
    page: int
    page_size: int
    items: List[PrendaResponse]