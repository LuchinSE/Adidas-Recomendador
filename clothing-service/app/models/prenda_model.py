from sqlalchemy import Column, Float, Integer, String, Boolean
from sqlalchemy.dialects.postgresql import ARRAY
from app.database.connection import Base

class Prenda(Base):
    __tablename__ = "prendas"

    id = Column(Integer, primary_key=True, index=True)
    descripcion = Column(String, nullable=False)
    ruta_imagen = Column(String, nullable=False)
    categoria = Column(String, nullable=False)
    estado = Column(Boolean, default=True)
    embedding = Column(ARRAY(Float))