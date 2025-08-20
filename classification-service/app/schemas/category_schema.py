from pydantic import BaseModel

class ImageInput(BaseModel):
    ruta_imagen: str  # Ruta de la imagen a clasificar

class CategoryOutput(BaseModel):
    categoria: str
    confianza: float