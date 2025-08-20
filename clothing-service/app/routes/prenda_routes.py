from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import SessionLocal
from app.models.prenda_model import Prenda
from app.schemas.prenda_schema import PrendaCreate, PrendaResponse, PrendaUpdate
from app.crud import prenda_crud

router = APIRouter(prefix="/prendas", tags=["Prendas"])

# Dependencia para obtener una sesión de base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=PrendaResponse)
def crear_prenda(prenda: PrendaCreate, db: Session = Depends(get_db)):
    existente = prenda_crud.buscar_por_descripcion(db, prenda.descripcion)
    if existente:
        raise HTTPException(status_code=400, detail="Ya existe una prenda con esa descripción")
    return prenda_crud.crear_prenda(db, prenda)

@router.post("/detalles")
def obtener_detalles_prendas(ids: List[int], db: Session = Depends(get_db)):
    prendas = db.query(Prenda).filter(Prenda.id.in_(ids)).all()
    if not prendas:
        raise HTTPException(status_code=404, detail="No se encontraron prendas.")
    
    return [
        {
            "nombre": prenda.descripcion,
            "url_imagen": "http://192.168.1.51:8000/static/"+prenda.ruta_imagen,
            
        }
        for prenda in prendas
    ]


@router.get("/", response_model=list[PrendaResponse])
def obtener_prendas_activas(db: Session = Depends(get_db)):
    return prenda_crud.obtener_prendas_activas(db)

@router.get("/{prenda_id}", response_model=PrendaResponse)
def obtener_prenda_por_id(prenda_id: int, db: Session = Depends(get_db)):
    prenda = prenda_crud.obtener_prenda_por_id(db, prenda_id)
    if prenda is None:
        raise HTTPException(status_code=404, detail="Prenda no encontrada")
    return prenda

@router.get("/categoria/{categoria}", response_model=list[PrendaResponse])
def obtener_prendas_por_categoria(categoria: str, db: Session = Depends(get_db)):
    prendas = prenda_crud.obtener_prendas_por_categoria(db, categoria)
    if not prendas:
        raise HTTPException(status_code=404, detail="No se encontraron prendas en esta categoría")
    return prendas

@router.put("/{prenda_id}", response_model=PrendaResponse)
def actualizar_prenda(prenda_id: int, datos: PrendaUpdate, db: Session = Depends(get_db)):
    prenda_actualizada = prenda_crud.actualizar_prenda(db, prenda_id, datos)
    if prenda_actualizada is None:
        raise HTTPException(status_code=404, detail="Prenda no encontrada")
    return prenda_actualizada

@router.delete("/{prenda_id}", response_model=PrendaResponse)
def eliminar_prenda(prenda_id: int, db: Session = Depends(get_db)):
    prenda = prenda_crud.eliminar_prenda_logicamente(db, prenda_id)
    if prenda is None:
        raise HTTPException(status_code=404, detail="Prenda no encontrada")
    return prenda



