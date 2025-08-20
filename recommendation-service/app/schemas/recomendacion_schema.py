from pydantic import BaseModel
from typing import List
from datetime import datetime

class RecomendacionCreate(BaseModel):
    usuario_id: int

class RecomendacionResponse(BaseModel):
    id: int
    usuario_id: int
    fecha: datetime
    prendas_recomendadas: List[int]

    class Config:
        from_attributes = True