from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.connection import SessionLocal
from app.models.prenda_model import Prenda
from app.schemas.prenda_schema import PrendaCreate, PrendaResponse, PrendaUpdate, PaginatedPrendaResponse
from app.crud import prenda_crud

router = APIRouter(prefix="/prendas", tags=["Prendas"])

# Dependencia para obtener una sesión de base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# RUTAS ESPECÍFICAS PRIMERO - para evitar conflictos
@router.get("/search", response_model=PaginatedPrendaResponse)
def buscar_prendas(
    texto: str = Query(..., description="Texto a buscar en la descripción"),
    skip: int = Query(0, ge=0, description="Número de registros a omitir"),
    limit: int = Query(10, gt=0, le=100, description="Número de registros a devolver"),
    db: Session = Depends(get_db)
):
    if not texto.strip():
        raise HTTPException(status_code=400, detail="El texto de búsqueda no puede estar vacío")
    
    total, prendas = prenda_crud.buscar_prendas_por_texto(db, texto, skip=skip, limit=limit)

    for prenda in prendas:
        prenda.url_imagen_completa = f"http://localhost:8082/static/{prenda.ruta_imagen}"

    return {
        "total": total,
        "page": (skip // limit) + 1,
        "page_size": limit,
        "items": prendas
    }

@router.get("/multiple", response_model=List[PrendaResponse])
def obtener_prendas_por_ids(ids: str = Query(..., description="Comma-separated list of product IDs"), db: Session = Depends(get_db)):
    try:
        id_list = [int(id.strip()) for id in ids.split(',')]
    except ValueError:
        raise HTTPException(status_code=400, detail="IDs must be comma-separated integers")
    
    if not id_list:
        return []
    
    prendas = db.query(Prenda).filter(Prenda.id.in_(id_list), Prenda.estado == True).all()
    
    for prenda in prendas:
        prenda.url_imagen_completa = f"http://localhost:8082/static/{prenda.ruta_imagen}"
    
    return prendas

@router.post("/detalles")
def obtener_detalles_prendas(ids: List[int], db: Session = Depends(get_db)):
    prendas = db.query(Prenda).filter(Prenda.id.in_(ids)).all()
    if not prendas:
        raise HTTPException(status_code=404, detail="No se encontraron prendas.")
    
    return [
        {
            "nombre": prenda.descripcion,
            "url_imagen": f"http://localhost:8082/static/{prenda.ruta_imagen}",
        }
        for prenda in prendas
    ]

# RUTAS GENERALES
@router.get("/", response_model=PaginatedPrendaResponse)
def obtener_prendas_activas(
    skip: int = Query(0, ge=0, description="Número de registros a omitir"),
    limit: int = Query(10, gt=0, le=100, description="Número de registros a devolver"),
    db: Session = Depends(get_db)
):
    total, prendas = prenda_crud.obtener_prendas_activas(db, skip=skip, limit=limit)

    for prenda in prendas:
        prenda.url_imagen_completa = f"http://localhost:8082/static/{prenda.ruta_imagen}"

    return {
        "total": total,
        "page": (skip // limit) + 1,
        "page_size": limit,
        "items": prendas
    }

# RUTAS CON PARÁMETROS - AL FINAL
@router.get("/usuario/{usuario_id}", response_model=List[PrendaResponse])
def obtener_prendas_por_usuario(usuario_id: int, db: Session = Depends(get_db)):
    prendas = prenda_crud.obtener_prendas_por_usuario(db, usuario_id)
    if not prendas:
        raise HTTPException(status_code=404, detail="El usuario no tiene prendas registradas")

    for prenda in prendas:
        prenda.url_imagen_completa = f"http://localhost:8082/static/{prenda.ruta_imagen}"

    return prendas

@router.get("/categoria/{categoria}", response_model=List[PrendaResponse])
def obtener_prendas_por_categoria(categoria: str, db: Session = Depends(get_db)):
    prendas = prenda_crud.obtener_prendas_por_categoria(db, categoria)
    if not prendas:
        raise HTTPException(status_code=404, detail="No se encontraron prendas en esta categoría")
    
    for prenda in prendas:
        prenda.url_imagen_completa = f"http://localhost:8082/static/{prenda.ruta_imagen}"
    
    return prendas

@router.get("/{prenda_id}", response_model=PrendaResponse)
def obtener_prenda_por_id(prenda_id: int, db: Session = Depends(get_db)):
    prenda = prenda_crud.obtener_prenda_por_id(db, prenda_id)
    if prenda is None:
        raise HTTPException(status_code=404, detail="Prenda no encontrada")
    
    prenda.url_imagen_completa = f"http://localhost:8082/static/{prenda.ruta_imagen}"
    return prenda

@router.put("/{prenda_id}", response_model=PrendaResponse)
def actualizar_prenda(prenda_id: int, datos: PrendaUpdate, db: Session = Depends(get_db)):
    prenda_actualizada = prenda_crud.actualizar_prenda(db, prenda_id, datos)
    if prenda_actualizada is None:
        raise HTTPException(status_code=404, detail="Prenda no encontrada")
    
    prenda_actualizada.url_imagen_completa = f"http://localhost:8082/static/{prenda_actualizada.ruta_imagen}"
    return prenda_actualizada

@router.delete("/{prenda_id}", response_model=PrendaResponse)
def eliminar_prenda(prenda_id: int, db: Session = Depends(get_db)):
    prenda = prenda_crud.eliminar_prenda_logicamente(db, prenda_id)
    if prenda is None:
        raise HTTPException(status_code=404, detail="Prenda no encontrada")
    
    prenda.url_imagen_completa = f"http://localhost:8082/static/{prenda.ruta_imagen}"
    return prenda