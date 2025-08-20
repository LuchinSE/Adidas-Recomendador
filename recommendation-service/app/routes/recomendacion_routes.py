from fastapi import APIRouter, Request, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import requests

from app.database.connection import get_db
from app.models.recomendacion_model import Recomendacion
from app.services.similarity_service import calcular_recomendaciones

router = APIRouter(prefix="/recommendations", tags=["Recomendaciones"])

# FUNCION AUXILIAR PARA VALIDAR SI EL USUARIO EXISTE EN EL USER-SERVICE
def validar_usuario(usuario_id: int, token: str) -> bool:
    try:
        headers = {"Authorization": f"Bearer {token}"}
        url = f"http://192.168.1.51:8080/api/usuarios/{usuario_id}"
        print(f"Consultando user-service en: {url} con token")
        response = requests.get(url, headers=headers)
        print(f"Status code: {response.status_code}")
        print(f"Response body: {response.text}")
        
        if response.status_code != 200:
            return False
        return response.json() is not None and response.json() != {}
    except Exception as e:
        print(f"Error al validar usuario: {e}")
        return False

# ENDPOINT PARA CREAR UNA NUEVA RECOMENDACIÓN
@router.post("/")
async def generar_recomendacion(
    request: Request,
    usuario_id: int = Form(...),
    imagenes: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    
    token = request.headers.get("Authorization", "").replace("Bearer ", "")

    #if not token:
        #raise HTTPException(status_code=401, detail="Token no encontrado en la solicitud.")

    if len(imagenes) > 5:
        raise HTTPException(status_code=400, detail="Solo se permiten hasta 5 imágenes.")

    # Validar existencia del usuario
    #if not validar_usuario(usuario_id, token):
        #raise HTTPException(status_code=404, detail="Usuario no encontrado en user-service.")

    try:
        # Leer los bytes de las imágenes
        imagenes_bytes = [await img.read() for img in imagenes]

        # Calcular recomendaciones
        prendas_recomendadas = calcular_recomendaciones(imagenes_bytes,token)

        # Guardar recomendación en la base de datos
        recomendacion = Recomendacion(
            usuario_id=usuario_id,
            prendas_recomendadas=prendas_recomendadas
        )
        db.add(recomendacion)
        db.commit()
        db.refresh(recomendacion)

        return {
            "mensaje": "Recomendación generada exitosamente.",
            "recomendacion_id": recomendacion.id,
            "prendas_recomendadas": prendas_recomendadas
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al generar recomendación: {str(e)}")
    
# ENDPOINT PARA OBTENER RECOMENDACIONES GUARDADAS DE UN USUARIO
@router.get("/{usuario_id}")
def obtener_recomendaciones_usuario(usuario_id: int, db: Session = Depends(get_db)):
    #if not validar_usuario(usuario_id):
        #raise HTTPException(status_code=404, detail="Usuario no encontrado en user-service.")
    
    recomendaciones = db.query(Recomendacion).filter(Recomendacion.usuario_id == usuario_id).all()

    return [
        {
            "recomendacion_id": r.id,
            "usuario_id": r.usuario_id,
            "fecha": r.fecha,
            "prendas_recomendadas": r.prendas_recomendadas,
        }
        for r in recomendaciones
    ]