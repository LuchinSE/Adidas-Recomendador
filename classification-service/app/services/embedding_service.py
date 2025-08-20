from app.utils.image_utils import preprocess_image_desde_bytes
from app.models.model_loader import modelo_embedding

def obtener_embedding(imagen_bytes: bytes):
    imagen_tensor = preprocess_image_desde_bytes(imagen_bytes)
    vector = modelo_embedding.predict(imagen_tensor)
    return vector[0].tolist()