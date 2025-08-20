from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# URL de conexion
DATABASE_URL = "postgresql://postgres:postgres@192.168.1.51:5432/garmentdb"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Función para crear las tablas
def crear_base():
    from app.models.prenda_model import Prenda  # Importamos aquí para que detecte el modelo
    Base.metadata.create_all(bind=engine)
