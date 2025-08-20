from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.category_service import clasificar_imagen
from app.services.embedding_service import obtener_embedding
from pydantic import BaseModel, HttpUrl
import requests
import numpy as np
import io
import os

router = APIRouter()

class ImageURL(BaseModel):
    url: HttpUrl

class ImagePathRequest(BaseModel):
    path: str

@router.post("/predict")
async def predecir_categoria_endpoint(imagen: UploadFile = File(...)):
    try:
        return clasificar_imagen(imagen)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al procesar imagen: {e}")

@router.post("/embedding")
async def obtener_embedding_endpoint(imagen: UploadFile = File(...)):
    try:
        contenido = await imagen.read()
        return {"embedding": obtener_embedding(contenido)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al generar embedding: {e}")
    
@router.post("/predict-from-url")
def predict_from_url(payload: ImageURL):
    try:
        response = requests.get(payload.url)
        response.raise_for_status()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al descargar la imagen: {str(e)}")
    
    imagen_bytes = response.content
    embedding = obtener_embedding(imagen_bytes)
    return {"embedding": embedding}

@router.post("/predict-from-path")
def predict_from_path(request: ImagePathRequest):
    if not os.path.exists(request.path):
        raise HTTPException(status_code=404, detail="Ruta de imagen no encontrada.")

    try:
        with open(request.path, "rb") as f:
            image_bytes = f.read()
        embedding = obtener_embedding(image_bytes)
        return {"embedding": embedding}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error procesando la imagen: {str(e)}")