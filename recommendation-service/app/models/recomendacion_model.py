from sqlalchemy import Column, Integer, DateTime, ARRAY
from datetime import datetime
from app.database.connection import Base

class Recomendacion(Base):
    __tablename__ = "recomendaciones"

    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, nullable=False)
    fecha = Column(DateTime, default=datetime.utcnow)
    prendas_recomendadas = Column(ARRAY(Integer), nullable=False)