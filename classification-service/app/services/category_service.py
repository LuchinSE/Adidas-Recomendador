import numpy as np
from fastapi import UploadFile, HTTPException
from app.models.model_loader import modelo_clasificador
from app.utils.image_utils import preprocess_image_bytes

CLASES = ['T-shirt/top', 'Trouser', 'Pullover', 'Dress', 'Coat', 
          'Sandal', 'Shirt', 'Sneaker', 'Bag', 'Ankle boot']

def clasificar_imagen(file: UploadFile):
    try:
        imagen_tensor = preprocess_image_bytes(file)
        predicciones = modelo_clasificador.predict(imagen_tensor)
        clase_predicha = int(np.argmax(predicciones[0]))
        confianza = float(np.max(predicciones[0]))

        return {
            "categoria": CLASES[clase_predicha],
            "confianza": confianza
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al clasificar la imagen: {str(e)}")