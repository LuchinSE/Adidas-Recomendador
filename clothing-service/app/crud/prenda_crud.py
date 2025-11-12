import requests  
from sqlalchemy.orm import Session 
from app.models.prenda_model import Prenda
from app.schemas.prenda_schema import PrendaCreate

# Crear una nueva prenda
def crear_prenda(db: Session, prenda: PrendaCreate):
    # Paso 1: Construir la URL pública de la imagen
    image_url = f"http://192.168.1.51:8000/static/{prenda.ruta_imagen}"
    
    # Paso 2: Llamar al classification-service para obtener el embedding
    try:
        response = requests.post(
            "http://192.168.1.51:8001/predict-from-url",
            json={"url": image_url}
        )
        response.raise_for_status()
        embedding = response.json().get("embedding")
    except Exception as e:
        print(f"Error al obtener embedding: {e}")
        embedding = None

    # Paso 3: Guardar la prenda con el embedding obtenido
    nueva_prenda = Prenda(
        descripcion=prenda.descripcion,
        ruta_imagen=prenda.ruta_imagen,
        categoria=prenda.categoria,
        estado=prenda.estado,
        embedding=embedding,
        usuario_id=prenda.usuario_id
    )
    db.add(nueva_prenda)
    db.commit()
    db.refresh(nueva_prenda)
    return nueva_prenda
# Obtener todas las prendas activas
def obtener_prendas_activas(db: Session, skip: int = 0, limit: int = 10):
    query = db.query(Prenda).filter(Prenda.estado == True)
    total = query.count()
    prendas = query.offset(skip).limit(limit).all()
    return total, prendas

# Obtener prenda por ID
def obtener_prenda_por_id(db: Session, prenda_id: int):
    return db.query(Prenda).filter(Prenda.id == prenda_id).first()

# Obtener por descripcion
def buscar_por_descripcion(db: Session, descripcion: str):
    return db.query(Prenda).filter(Prenda.descripcion == descripcion).first()

# Obtener prendas por categoría
def obtener_prendas_por_categoria(db: Session, categoria: str):
    return db.query(Prenda).filter(
        Prenda.categoria == categoria,
        Prenda.estado == True
    ).all()

# Actualizar prenda
def actualizar_prenda(db: Session, prenda_id: int, prenda_data):
    prenda = db.query(Prenda).filter(Prenda.id == prenda_id, Prenda.estado == True).first()
    if not prenda:
        return None

    data_dict = prenda_data.dict(exclude_unset=True)  # Solo campos enviados
    for key, value in data_dict.items():
        setattr(prenda, key, value)

    db.commit()
    db.refresh(prenda)
    return prenda

# Eliminación lógica (estado = False)
def eliminar_prenda_logicamente(db: Session, prenda_id: int):
    prenda = db.query(Prenda).filter(Prenda.id == prenda_id).first()
    if prenda:
        prenda.estado = False
        db.commit()
    return prenda

# Obtener prendas por lista de IDs
def obtener_prendas_por_ids(db: Session, usario_id: int):
    return db.query(Prenda).filter(
        Prenda.usuario_id == usario_id, 
        Prenda.estado == True).all()

def obtener_prendas_por_usuario(db: Session, usuario_id: int):
    return db.query(Prenda).filter(
        Prenda.usuario_id == usuario_id,
        Prenda.estado == True
    ).all()

def buscar_prendas_por_texto(db: Session, texto: str, skip: int = 0, limit: int = 10):
    query = db.query(Prenda).filter(
        Prenda.descripcion.ilike(f"%{texto}%"),
        Prenda.estado == True
    )
    total = query.count()
    prendas = query.offset(skip).limit(limit).all()
    return total, prendas