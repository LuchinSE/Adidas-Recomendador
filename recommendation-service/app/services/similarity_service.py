import requests
import numpy as np
from typing import List

def obtener_embedding_de_bytes(image_bytes: bytes, token: str) -> List[float]:
    headers = {
        "Authorization": f"Bearer {token}"
    }
    response = requests.post(
        "http://192.168.1.51:8001/embedding",
        files={"imagen": ("image.jpg", image_bytes, "image/jpeg")},
        headers=headers
    )
    response.raise_for_status()
    return response.json()["embedding"]

def obtener_prendas_desde_clothing(token: str) -> List[dict]:
    headers = {
        "Authorization": f"Bearer {token}"
    }
    response = requests.get("http://192.168.1.51:8000/prendas", headers=headers)
    response.raise_for_status()
    return response.json()

def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def calcular_recomendaciones(imagenes_bytes: List[bytes], token: str, top_k: int = 5) -> List[int]:
    embeddings_usuario = [
        np.array(obtener_embedding_de_bytes(img,token)) for img in imagenes_bytes
    ]

    prendas = obtener_prendas_desde_clothing(token)
    prendas_con_embeddings = [
        (p["id"], np.array(p["embedding"]))
        for p in prendas if p["embedding"] is not None
    ]

    similitudes = {}
    for user_emb in embeddings_usuario:
        for prenda_id, emb in prendas_con_embeddings:
            sim = cosine_similarity(user_emb, emb)
            similitudes[prenda_id] = max(similitudes.get(prenda_id, 0), sim)

    # Ordenar y retornar los top K
    top_ids = sorted(similitudes.items(), key=lambda x: x[1], reverse=True)[:top_k]
    return [prenda_id for prenda_id, _ in top_ids]